import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Channel from "@/models/channel";
import { connectMongoDB } from "@/lib/mongodb";
import API from "@/models/API";
import LineUser from "@/models/LineUser";
import { formatResponse } from "@/lib/utils";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "name";
    const orderDirection =
      searchParams.get("orderDirection") === "desc" ? -1 : 1;
    const pageNumber = parseInt(searchParams.get("pageNumber")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    if (id) {
      const channel = await Channel.findById(id);
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }

      if (channel.user_id.toString() !== session.user._id.toString()) {
        return formatResponse(403, {
          message: "Unauthorized: You do not have permission to access this channel.",
        });
      }


      return formatResponse(200, { Channel: channel });
    } else {
      if (!session.user._id) {
        return formatResponse(400, {
          message: "Missing required fields.",
        });
      }
      const filter = {
        ...(session.user._id && {
          user_id: new mongoose.Types.ObjectId(session.user._id),
        }),
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }),
      };

      const totalChannels = await Channel.countDocuments(filter);

      const channels = await Channel.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);


      return formatResponse(200, {
        Channel: channels,
        Total: totalChannels,
      });
    }
  } catch (error) {
    console.error(error);
    return formatResponse(500, { message: "Internal server error." });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }

  await connectMongoDB();

  try {
    const body = await req.json();
    const {
      name,
      description,
      webhook_url,
      status,
      channel_id,
      channel_secret,
      channel_access_token,
      destination,
    } = body;

    if (
      !name ||
      !webhook_url ||
      !channel_id ||
      !channel_secret ||
      !channel_access_token ||
      !destination
    ) {
      return formatResponse(400, {
        message: "Please provide all required fields.",
      });
    }

    const newChannel = new Channel({
      name,
      description,
      webhook_url,
      status,
      user_id: new mongoose.Types.ObjectId(session.user._id),
      channel_id,
      channel_secret,
      channel_access_token,
      destination,
    });

    const savedChannel = await newChannel.save();
    return formatResponse(201, { Channel: savedChannel });
  } catch (error) {
    console.error(error);
    return formatResponse(500, { message: "Internal server error." });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }

  await connectMongoDB();

  try {
    const body = await req.json();
    const {
      id,
      name,
      description,
      webhook_url,
      status,
      channel_id,
      channel_secret,
      channel_access_token,
      destination,
    } = body;

    if (!id) {
      return formatResponse(400, { message: "Please provide channel ID." });
    }

    // check if the channel exists and the user has access to it
    const existingChannel = await Channel.findById(id);
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, {
        message: "No access this Channel",
      });
    }

    const updateData = {
      name,
      description,
      webhook_url,
      status,
      channel_id,
      channel_secret,
      channel_access_token,
      destination,
    };

    const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return formatResponse(200, { Channel: updatedChannel });
  } catch (error) {
    console.error(error);
    return formatResponse(500, { message: "Internal server error." });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }

  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return formatResponse(400, { message: "Please provide channel ID." });
    }

    // check if the channel exists and the user has access to it
    const existingChannel = await Channel.findById(id);
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, {
        message: "No access this Channel",
      });
    }


    // delete all related data
    await API.deleteMany({ channel_id: new mongoose.Types.ObjectId(id) });
    await LineUser.deleteMany({ channel_id: new mongoose.Types.ObjectId(id) });
    await Channel.findByIdAndDelete(id.toString());

    return formatResponse(200, { message: "Channel deleted successfully." });
  } catch (error) {
    console.error(error);
    return formatResponse(500, { message: "Internal server error." });
  }
}
