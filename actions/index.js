"use server";

import { connectMongoDB } from "@/lib/mongodb";
import API from "@/models/API";
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

export const getAllLineUsersByUserId = async (userIds) => {
  // Ensure MongoDB is connected
  await connectMongoDB();

  try {
    // Use $in to query multiple userIds
    const lineUsers = await LineUser.find({ line_user_id: { $in: userIds } });
    console.log("Line Users:", lineUsers);
    return JSON.stringify(lineUsers);
  } catch (error) {
    console.error("Error querying Line users by user ids in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const getAllApis = async (channelId) => {
  await connectMongoDB();

  try {
    // Explicitly ensure channelId is treated as a string
    const api = await API.find({ channel_id: channelId });

    return JSON.stringify(api);
  } catch (error) {
    console.error("Error Query API in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};
