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

// UPDATE USER SETTINGS =========================================================================
export async function updateUserSettings(
  id: string,
  updateData: {
    steps?: {
      gratitude?: boolean;
      reflection?: boolean;
    };
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

    if (updateData.steps) {
      Object.entries(updateData.steps).forEach(([key, value]) => {
        update.$set[`settings.steps.${key}`] = value;
      });
    }

    if (updateData.journalStartTime) {
      Object.entries(updateData.journalStartTime).forEach(([key, value]) => {
        update.$set[`settings.journalStartTime.${key}`] = value;
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
    return { user: null, error: "Failed to update user settings" };
  }
}

// This one used to increment the values in a PREDEFINED discipline{}
// // UPDATE USER DISCIPLINES =====================================================================
// export async function updateUserDisciplines(
//   userId: string,
//   disciplines: UserDisciplines
// ): Promise<{
//   user: User | null;
//   status: "success" | "no_change";
//   error?: string;
// }> {
//   try {
//     if (!users) await init();

//     const query = { _id: new ObjectId(userId) };
//     const update: { $inc: { [key: string]: any } } = { $inc: {} };

//     // Only update the specified disciplines
//     Object.entries(disciplines).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         update.$inc[`settings.disciplines.${key}`] = value;
//       }
//     });

//     // If there's nothing to update, return early
//     if (Object.keys(update.$inc).length === 0) {
//       return {
//         user: null,
//         status: "no_change",
//       };
//     }

//     const result = await users.findOneAndUpdate(query, update, {
//       returnDocument: "after",
//     });

//     if (!result) {
//       return {
//         user: null,
//         status: "no_change",
//         error: "User not found",
//       };
//     }

//     return {
//       user: result,
//       status: "success",
//     };
//   } catch (error) {
//     console.error("Error updating disciplines:", error);
//     return {
//       user: null,
//       status: "no_change",
//       error: "Failed to update user disciplines",
//     };
//   }
// }

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
        // Check if this discipline exists in the user's settings
        const disciplinePath = `settings.disciplines.${key}`;
        const exists =
          currentUser.settings?.disciplines &&
          currentUser.settings.disciplines[key] !== undefined;

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

// NOTE: check if this is still used!!!!
// UPDATE USER HABITS CHECK =====================================================================
export async function getUserLastUpdateTime(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  return user?.lastUpdateTime;
}

export async function updateUserLastUpdateTime(
  userId: string,
  updateTime: string
) {
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastUpdateTime: updateTime } }
    );
}
