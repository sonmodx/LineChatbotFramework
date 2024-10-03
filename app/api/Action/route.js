import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import Action from "@/models/action";
import { formatResponse } from "@/lib/utils";

// method get
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
      const action = await Action.findById(id);
      if (!action) {
        return formatResponse(404, { message: "Message not found." });
      }

      return formatResponse(200, { Action: action });
    } else {
      if (!session.user._id) {
        return formatResponse(400, {
          message: "Missing required fields.",
        });
      }

      const actions = await Action.find({
        list_user: session.user._id,
        name: { $regex: search, $options: "i" },
      })
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      return formatResponse(200, { Actions: actions });
    }
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}

// method post
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }
  await connectMongoDB();

  try {
    const { action_type } = new URL(req.url);
    const {
      name,
      type,
      description,
      channel_id,
      api_id,
      message,
      keyword,
    } = await req.json();

    if (action_type === "reply message") {
      if (
        !name ||
        !type ||
        !channel_id ||
        !api_id ||
        !message ||
        !keyword
      ) {
        return formatResponse(400, { message: "Missing required fields." });
      }
      const newAction = new Action({
        name,
        type,
        description,
        channel_id: mongoose.Types.ObjectId(channel_id),
        api_id: mongoose.Types.ObjectId(api_id),
        message,
        keyword,
      });

      const savedAction = await newAction.save();

      return formatResponse(201, { Action: savedAction });
    } else if (action_type === "broadcast message") {
      // code for broadcast message
    } else if (action_type === "push message") {
      // code for send message
    } else if (action_type === "multicast message") {
      // code for multicast message
    } else if (action_type === "Narrowcast message") {
      // code for Narrowcast message
    } else if (action_type === "greeting message") {
      // code for greeting message
    } else if (action_type === "rich menu") {
      // code for rich menu
    } else {
      return formatResponse(400, { message: "Invalid action type." });
    }
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}

// method put
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }
  await connectMongoDB();

  try {
    const { id } = new URL(req.url);
    const {
      name,
      type,
      description,
      channel_id,
      api_id,
      message,
      keyword,
    } = await req.json();

    const action = await Action.findById(id);
    if (!action) {
      return formatResponse(404, { message: "Message not found." });
    }

    if (
      session.user._id &&
      session.user._id.toString() !== message.list_user.toString()
    ) {
      return formatResponse(401, { message: "Unauthorized" });
    }

    const updateData = {
      name,
      type,
      description,
      channel_id: mongoose.Types.ObjectId(channel_id),
      api_id: mongoose.Types.ObjectId(api_id),
      message,
      keyword,
    };

    const updatedAction = await Action.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return formatResponse(200, { Action: updatedAction });
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}

// method delete
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }
  await connectMongoDB();

  try {
    const { id } = new URL(req.url);

    const action = await Action.findById(id);
    if (!action) {
      return formatResponse(404, { message: "Message not found." });
    }

    if (
      session.user._id &&
      session.user._id.toString() !== message.list_user.toString()
    ) {
      return formatResponse(401, { message: "Unauthorized" });
    }

    await action.delete();

    return formatResponse(200, { message: "Message deleted." });
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}
