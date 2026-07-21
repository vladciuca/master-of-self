import { MongoClient, Db, Collection } from "mongodb";
import clientPromise from "./mongodb";
import { User } from "@models/mongodb";
import { UserDisciplines, UserPractices } from "@models/types";

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

type NewUserData = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// GET USER =====================================================================================
export async function getUser(
  id: string,
  getUserData?: () => Promise<NewUserData>
): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();

    const user = await users.findOne({ _id: id });
    if (user) {
      return { user };
    }

    return getOrCreateUser(id, getUserData ? await getUserData() : undefined);
  } catch (error) {
    return { user: null, error: "Failed to fetch user" };
  }
}

export async function getOrCreateUser(
  userId: string,
  userData?: NewUserData
): Promise<{
  user: User | null;
  error?: string;
}> {
  try {
    if (!users) await init();

    // Atomic upsert: safe under concurrent first-contact requests
    const user = await users.findOneAndUpdate(
      { _id: userId },
      {
        $setOnInsert: {
          _id: userId,
          name: userData?.name ?? null,
          email: userData?.email ?? null,
          image: userData?.image ?? null,
          profile: {
            willpowerMultiplier: 1.5,
            disciplines: { discipline: 0 },
            practices: {},
            activePractices: [],
            journalStartTime: { morning: "08:00", evening: "18:00" },
            onboardingCompleted: false,
          },
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (!user) {
      throw new Error("Failed to create new user");
    }

    return { user };
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

    const { user: provisioned, error: provisionError } = await getOrCreateUser(
      id
    );
    if (provisionError || !provisioned) {
      throw new Error(provisionError || "User not found");
    }

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

export async function updateUserPracticesValues(
  userId: string,
  values: UserDisciplines & UserPractices
): Promise<{
  user: User | null;
  status: "success" | "no_change";
  error?: string;
}> {
  try {
    if (!users) await init();

    const query = { _id: userId };

    // First, fetch the current user to check existing values
    const { user: currentUser, error: provisionError } = await getOrCreateUser(
      userId
    );
    if (provisionError || !currentUser) {
      return {
        user: null,
        status: "no_change",
        error: provisionError || "User not found",
      };
    }

    const incUpdate: { [key: string]: number } = {};
    const setUpdate: { [key: string]: number } = {};

    // Check each value to determine if we need to increment or set
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const isBaseDiscipline = key === "discipline";
        const profilePath = isBaseDiscipline
          ? `profile.disciplines.${key}`
          : `profile.practices.${key}`;

        const existingMap = isBaseDiscipline
          ? currentUser.profile?.disciplines
          : currentUser.profile?.practices;
        const exists = existingMap && existingMap[key] !== undefined;

        if (exists) {
          // Use $inc for existing values
          incUpdate[profilePath] = value;
        } else {
          // Use $set for new values
          setUpdate[profilePath] = value;
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
    console.error("Error updating practices:", error);
    return {
      user: null,
      status: "no_change",
      error: "Failed to update user practices",
    };
  }
}

// UPDATE USER ACTIVE PRACTICES LIST =======================================================
// Adds / Removes IDs for the list -> used for RENDERING JOURNAL STEPS
export async function updateActivePractices(
  userId: string,
  practiceId: string,
  action: "add" | "remove"
): Promise<{
  user: User | null;
  status: "success" | "no_change";
  error?: string;
}> {
  try {
    if (!users) await init();

    const { user: provisioned, error: provisionError } = await getOrCreateUser(
      userId
    );
    if (provisionError || !provisioned) {
      return {
        user: null,
        status: "no_change",
        error: provisionError || "User not found",
      };
    }

    const query = { _id: userId };
    const update =
      action === "add"
        ? {
            $addToSet: {
              "profile.activePractices": practiceId,
            },
          }
        : {
            $pull: {
              "profile.activePractices": practiceId,
            },
          };

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
    console.error("Error updating active practices:", error);
    return {
      user: null,
      status: "no_change",
      error: "Failed to update user active practices",
    };
  }
}
