import mongoose from "mongoose";
import { MONGO_URI } from "./env.config";

export default class Database {
  private static instance: mongoose.Connection;

  private constructor() {}

  public static async getInstance(): Promise<mongoose.Connection> {
    if (!Database.instance) {
      try {
        const connection = await mongoose.connect(MONGO_URI as string, {});
        Database.instance = connection.connection;
        console.log(`🔌 MongoDB connected !!`);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(`❌ MongoDB Connection Error: ${err.message}`);
        }
        throw new Error('❌ Unknown error occurred during DB connection');
      }
    }
    return Database.instance;
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await mongoose.disconnect();
      Database.instance = undefined as unknown as mongoose.Connection;
      console.log('🔌 MongoDB disconnected');
    }
  }
}

