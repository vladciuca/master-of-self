import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { User } from "@models/mongodb";

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
      gratefulStep?: boolean;
      reflectionStep?: boolean;
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
