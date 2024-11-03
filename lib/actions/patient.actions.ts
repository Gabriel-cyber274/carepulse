import { ID, Query } from "node-appwrite";
import { users } from "@/lib/appwrite.config";
import { parseStringify } from "../utils";

interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

export const createUser = async (user: CreateUserParams) => {
  console.log("Creating user with:", user);

  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return newUser;
  } catch (error: any) {
    console.error("Error in createUser:", error);
    if (error?.code === 409) {
      const documents = await users.list([Query.equal("email", user.email)]);
      return documents?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log("Error in getUser (patient.actions.ts):", error);
  }
}
