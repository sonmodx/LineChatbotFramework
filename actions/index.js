"use server";

import { connectMongoDB } from "@/lib/mongodb";
import Action from "@/models/action";
import API from "@/models/API";
import Audience from "@/models/audience";
import LineUser from "@/models/LineUser";
import RichMenu from "@/models/richmenu";

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

export const getAllLineUsersByUserId = async (channelId, userIds) => {
  // Ensure MongoDB is connected
  await connectMongoDB();

  try {
    // Use $in to query multiple userIds
    const lineUsers = await LineUser.find({
      channel_id: channelId,
      line_user_id: { $in: userIds },
    });
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

export const getApiById = async (apiId) => {
  if (!apiId) return;
  await connectMongoDB();

  try {
    // Explicitly ensure channelId is treated as a string
    const api = await API.findById(apiId);

    return JSON.stringify(api);
  } catch (error) {
    console.error("Error Query API in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const getAllAudiences = async (channelId) => {
  await connectMongoDB();

  try {
    // Explicitly ensure channelId is treated as a string
    const aud = await Audience.find({ channel_id: channelId });

    return JSON.stringify(aud);
  } catch (error) {
    console.error("Error Query Audience in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const getAllRichMenus = async (channelId) => {
  await connectMongoDB();

  try {
    // Explicitly ensure channelId is treated as a string
    const rich = await RichMenu.find({ channel_id: channelId });

    return JSON.stringify(rich);
  } catch (error) {
    console.error("Error Query Rich menu in DB:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const checkExistDefaultAction = async (channelId) => {
  await connectMongoDB();

  try {
    const action = await Action.exists({
      channel_id: channelId,
      type_action: "default",
    });

    return !!action;
  } catch (error) {
    console.error("Error Querying Default Action in DB:", error);
    throw error;
  }
};

export const checkExistKeywordReplyAction = async (
  channelId,
  listKeyword,
  excludeReplyId = null
) => {
  await connectMongoDB();

  try {
    const allReply = await Action.find({
      channel_id: channelId,
      type_action: "reply",
      ...(excludeReplyId && { _id: { $ne: excludeReplyId } }),
    }).lean();

    const existingKeywords = new Set();

    allReply.forEach((reply) => {
      if (reply.keyword) {
        reply.keyword.forEach((keyword) => {
          existingKeywords.add(keyword);
        });
      }
    });

    // Check if any keyword in listKeyword does not exist in existingKeywords
    const result = listKeyword.some((keyword) => existingKeywords.has(keyword));
    console.log("All keywords exist:", result);
    return result;
  } catch (error) {
    console.error("Error Querying Default Action in DB:", error);
    throw error;
  }
};
