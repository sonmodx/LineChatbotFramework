"use server";

import { connectMongoDB } from "@/lib/mongodb";
import LineUser from "@/models/LineUser";

export const getAllLineUsers = async (channelId) => {
  await connectMongoDB();

  try {
    // Query all LineUsers with the given channelId

    const lineUsers = await LineUser.find({ channel_id: channelId });

    return JSON.stringify(lineUsers);
  } catch (error) {
    console.error("Error Query Line users in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};
