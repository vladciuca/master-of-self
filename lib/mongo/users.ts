import { MongoClient, Db, Collection, ObjectId } from "mongodb";
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
    const query = { _id: new ObjectId(id) };

    const user = await users.findOne(query);

    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  } catch (error) {
    return { user: null, error: "Failed to fetch user" };
  }
}

// UPDATE USER PROFILE JOURNAL TIMES ======================================================
export async function updateUserProfile(
  id: string,
  updateData: {
    // steps?: {
    //   gratitude?: boolean;
    //   reflection?: boolean;
    // };
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
    const query = { _id: new ObjectId(id) };
    const update: { $set: { [key: string]: any } } = { $set: {} };

    //NOTE: Will be refactor after collections.step will be created
    // if (updateData.steps) {
    //   Object.entries(updateData.steps).forEach(([key, value]) => {
    //     update.$set[`profile.steps.${key}`] = value;
    //   });
    // }

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

//This one increments existing discipline{} values, and sets one that do not exist
export async function updateUserDisciplines(
  userId: string,
  disciplines: UserDisciplines
): Promise<{
  user: User | null;
  status: "success" | "no_change";
  error?: string;
}> {
  try {
    if (!users) await init();

    const query = { _id: new ObjectId(userId) };

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
    const update: any = {};
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

// UPDATE USER ACTIVE DISCIPLINES ==========================================================
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

    const query = { _id: new ObjectId(userId) };
    let update: any = {};

    if (action === "add") {
      // Add disciplineId if it doesn't exist already
      update = {
        $addToSet: { "profile.activeDisciplines": disciplineId },
      };
    } else if (action === "remove") {
      // Remove disciplineId from array
      update = {
        $pull: { "profile.activeDisciplines": disciplineId },
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
    console.error("Error updating active disciplines:", error);
    return {
      user: null,
      status: "no_change",
      error: "Failed to update user active disciplines",
    };
  }
}
