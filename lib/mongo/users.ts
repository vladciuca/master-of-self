import { MongoClient, Db, Collection } from "mongodb";
import clientPromise from "./mongodb";
import { User } from "@models/mongodb";
import { UserDisciplines } from "@models/types";

let client: MongoClient;
let db: Db;
let users: Collection<User>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("master_of_self");
    users = db.collection<User>("users");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

// GET USER =====================================================================================
export async function getUser(id: string): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();

    const user = await users.findOne({ _id: id });

    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  } catch (error) {
    return { user: null, error: "Failed to fetch user" };
  }
}

export async function getOrCreateUser(
  userId: string,
  userData?: { name?: string | null; email?: string | null; image?: string | null }
): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();

    const existingUser = await users.findOne({ _id: userId });
    if (existingUser) {
      return { user: existingUser };
    }

    const newUser: User = {
      _id: userId,
      name: userData?.name,
      email: userData?.email,
      image: userData?.image,
      profile: {
        willpowerMultiplier: 1.5,
        disciplines: { motivation: 0 },
        activeDisciplines: [],
        journalStartTime: { morning: "08:00", evening: "18:00" },
        onboardingCompleted: false,
      },
    };

    const result = await users.insertOne(newUser);
    if (!result.insertedId) {
      throw new Error("Failed to create new user");
    }

    return { user: newUser };
  } catch (error) {
    return { user: null, error: "Failed to get or create user" };
  }
}

// UPDATE ONBOARDING STATUS =====================================================================
export async function updateOnboardingStatus(
  userId: string,
  completed: boolean
): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();

    const user = await getOrCreateUser(userId);
    if (user.error || !user.user) {
      throw new Error(user.error || "User not found");
    }

    const query = { _id: userId };
    const update = {
      $set: {
        "profile.onboardingCompleted": completed,
      },
    };

    const result = await users.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!result) {
      throw new Error("User not found");
    }

    return { user: result };
  } catch (error) {
    return { user: null, error: "Failed to update onboarding status" };
  }
}

// NOTE: THIS UPDATES USER SETTINGS
// RIGHT NOW ONLY HANDLES JOURNAL TIMES
// UPDATE USER PROFILE JOURNAL TIMES ======================================================
export async function updateUserProfile(
  id: string,
  updateData: {
    journalStartTime?: {
      morning?: string;
      evening?: string;
    };
  }
): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();
    const query = { _id: id };
    const update: { $set: Record<string, string> } = { $set: {} };

    if (updateData.journalStartTime) {
      Object.entries(updateData.journalStartTime).forEach(([key, value]) => {
        update.$set[`profile.journalStartTime.${key}`] = value;
      });
    }

    const result = await users.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!result) {
      throw new Error("User not found");
    }

    return { user: result };
  } catch (error) {
    return { user: null, error: "Failed to update user profile" };
  }
}

// UPDATE DISCIPLINES VALUES =====================================================================
// increments existing discipline{} key values, and sets keys that do not exist
// key is discipline ID
export async function updateUserDisciplinesValues(
  userId: string,
  disciplines: UserDisciplines
): Promise<{
  user: User | null;
  status: "success" | "no_change";
  error?: string;
}> {
  try {
    if (!users) await init();

    const query = { _id: userId };

    // First, fetch the current user to check existing disciplines
    const currentUser = await users.findOne(query);
    if (!currentUser) {
      return {
        user: null,
        status: "no_change",
        error: "User not found",
      };
    }

    const incUpdate: { [key: string]: number } = {};
    const setUpdate: { [key: string]: number } = {};

    // Check each discipline to determine if we need to increment or set
    Object.entries(disciplines).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Check if this discipline exists in the user's profile
        const disciplinePath = `profile.disciplines.${key}`;
        const exists =
          currentUser.profile?.disciplines &&
          currentUser.profile.disciplines[key] !== undefined;

        if (exists) {
          // Use $inc for existing disciplines
          incUpdate[disciplinePath] = value;
        } else {
          // Use $set for new disciplines
          setUpdate[disciplinePath] = value;
        }
      }
    });

    // Prepare the update object with $inc and $set operations
    const update: { $inc?: Record<string, number>; $set?: Record<string, number> } = {};
    if (Object.keys(incUpdate).length > 0) {
      update.$inc = incUpdate;
    }
    if (Object.keys(setUpdate).length > 0) {
      update.$set = setUpdate;
    }

    // If there's nothing to update, return early
    if (Object.keys(update).length === 0) {
      return {
        user: null,
        status: "no_change",
      };
    }

    const result = await users.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!result) {
      return {
        user: null,
        status: "no_change",
        error: "User not found",
      };
    }

    return {
      user: result,
      status: "success",
    };
  } catch (error) {
    console.error("Error updating disciplines:", error);
    return {
      user: null,
      status: "no_change",
      error: "Failed to update user disciplines",
    };
  }
}

// UPDATE USER ACTIVE DISCIPLINES LIST =======================================================
// Adds / Removes IDs for the list -> used for RENDERING JOURNAL STEPS
export async function updateActiveDisciplines(
  userId: string,
  disciplineId: string,
  action: "add" | "remove"
): Promise<{
  user: User | null;
  status: "success" | "no_change";
  error?: string;
}> {
  try {
    if (!users) await init();

    const query = { _id: userId };
    const update =
      action === "add"
        ? { $addToSet: { "profile.activeDisciplines": disciplineId } }
        : { $pull: { "profile.activeDisciplines": disciplineId } };

    const result = await users.findOneAndUpdate(query, update, {
      returnDocument: "after",
    });

    if (!result) {
      return {
        user: null,
        status: "no_change",
        error: "User not found",
      };
    }

    return {
      user: result,
      status: "success",
    };
  } catch (error) {
    console.error("Error updating active disciplines:", error);
    return {
      user: null,
      status: "no_change",
      error: "Failed to update user active disciplines",
    };
  }
}
