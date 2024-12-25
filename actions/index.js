"use server";

import { connectMongoDB } from "@/lib/mongodb";
import LineUser from "@/models/LineUser";

export const getAllLineUsers = async (channelId) => {
  await connectMongoDB();

  try {
    // Explicitly ensure channelId is treated as a string
    const lineUsers = await LineUser.find({ channel_id: channelId });

    return JSON.stringify(lineUsers);
  } catch (error) {
    console.error("Error Query Line users in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};
