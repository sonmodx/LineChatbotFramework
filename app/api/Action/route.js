import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import Action from "@/models/action";
import { formatResponse } from "@/lib/utils";
import Channel from "@/models/channel";
import API from "@/models/API";

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
    const channel_id = searchParams.get("channel_id");
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
      const channel = await Channel.findById(action.channel_id.toString());
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      return formatResponse(200, { Action: action });
    } else {
      const channel = await Channel.findById(channel_id);
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      const filter = {
        ...(channel_id && {
          channel_id: new mongoose.Types.ObjectId(channel_id),
        }),
        ...(search && { name: { $regex: search, $options: "i" } }),
      };

      const totalActions = await Action.countDocuments(filter);

      const actions = await Action.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select("-__v")
        .lean();

      // Fetch all unique API names from the API collection
      const apiRecords = await API.find({}, "name").lean();

      // Create a mapping of API names
      const apiNameMap = apiRecords.reduce((acc, api) => {
        acc[api._id.toString()] = api.name;
        return acc;
      }, {});

      // Attach API names to the actions list
      const updatedActions = actions.map((action) => ({
        ...action,
        activeString: action.isActivated ? "active" : "inactive",
        api_name: apiNameMap[action.api_id?.toString()] || null, // Get api_name if api_id exists
      }));

      return formatResponse(200, {
        Actions: updatedActions,
        Total: totalActions,
      });
    }
  } catch (error) {
    console.log(error);
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
    const { searchParams } = new URL(req.url);
    const action_type = searchParams.get("action_type");
    const {
      name,
      type,
      description,
      channel_id,
      api_id,
      message,
      keyword,
      param,
      type_action,
      isActivated,
      useAI,
    } = await req.json();
    console.log("action_type", action_type);
    if (!name || !type || !channel_id || !message || !type_action) {
      return formatResponse(400, { message: "Missing required fields." });
    }

    const existingChannel = await Channel.findById(channel_id);
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    if (action_type === "reply_message") {
      let actionData = {
        name,
        type,
        type_action,
        description,
        channel_id: new mongoose.Types.ObjectId(channel_id),
        message,
        param,
        keyword,
        isActivated,
      };

      if (api_id) {
        actionData.api_id = new mongoose.Types.ObjectId(api_id);
      }

      const newAction = new Action(actionData);

      const savedAction = await newAction.save();

      return formatResponse(201, { Action: savedAction });
    } else if (action_type === "broadcast_message") {
      // code for broadcast message
    } else if (action_type === "push_message") {
      // code for send message
    } else if (action_type === "multicast_message") {
      // code for multicast message
    } else if (action_type === "Narrowcast_message") {
      // code for Narrowcast message
    } else if (
      action_type === "greeting_message" ||
      action_type === "default_message"
    ) {
      let actionData = {
        name,
        type,
        type_action,
        description,
        channel_id: new mongoose.Types.ObjectId(channel_id),
        message,
        isActivated,
        useAI,
      };

      if (api_id) {
        actionData.api_id = new mongoose.Types.ObjectId(api_id);
      }

      const newAction = new Action(actionData);

      const savedAction = await newAction.save();

      return formatResponse(201, { Action: savedAction });
    } else if (action_type === "rich_menu") {
      // code for rich menu
    } else {
      return formatResponse(400, { message: "Invalid action type." });
    }
  } catch (error) {
    console.log(error);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const {
      name,
      type,
      type_action,
      description,
      channel_id,
      api_id,
      param,
      message,
      keyword,
      isActivated,
      useAI,
    } = await req.json();

    const action = await Action.findById(id);

    if (!action) {
      return formatResponse(404, { message: "Message not found." });
    }

    const existingChannel = await Channel.findById(action.channel_id);

    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(401, { message: "Unauthorized" });
    }

    const updateData = {
      name,
      type,
      type_action,
      description,
      channel_id: new mongoose.Types.ObjectId(channel_id),
      message,
      param,
      keyword,
      isActivated,
      useAI,
    };
    console.log("server api_id", api_id);

    if (api_id === "") {
      updateData.api_id = ""; // Assign empty string
    } else if (api_id) {
      updateData.api_id = new mongoose.Types.ObjectId(api_id); // Assign ObjectId if valid
    }
    console.log("server api_id", updateData);

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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const action = await Action.findById(id);

    if (!action) {
      return formatResponse(404, { message: "Message not found." });
    }

    const existingChannel = await Channel.findById(
      action.channel_id.toString()
    );
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }

    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(401, { message: "Unauthorized" });
    }

    await Action.findByIdAndDelete(id);

    return formatResponse(200, { message: "Message deleted." });
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}
