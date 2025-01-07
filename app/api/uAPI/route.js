import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import API from "@/models/API";
import Channel from "@/models/channel";
import mongoose from "mongoose";
import { formatDate, formatResponse } from "@/lib/utils";

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
      const api = await API.findById(id);
      if (!api) {
        return formatResponse(404, { message: "API not found." });
      }

      const existingChannel = await Channel.findById(api.channel_id.toString());
      if (!existingChannel) {
        return formatResponse(404, { message: "Channel not found." });
      }

      if (
        session.user._id &&
        session.user._id !== existingChannel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      return formatResponse(200, { API: api });
    } else {
      const existingChannel = await Channel.findById(channel_id);
      if (!existingChannel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id !== existingChannel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      const filter = {
        ...(channel_id && {
          channel_id: new mongoose.Types.ObjectId(channel_id),
        }),
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }),
      };

      const totalAPIs = await API.countDocuments(filter);

      const apis = await API.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const formattedapis = apis.map((api) => ({
        ...api._doc,
        createdAt: formatDate(new Date(api.createdAt)),
        updatedAt: formatDate(new Date(api.updatedAt)),
      }));

      return formatResponse(200, {
        API: formattedapis,
        Total: totalAPIs,
      });
    }
  } catch (error) {
    console.error(error);
    return formatResponse(500, { message: "Internal server error." });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
  }

  await connectMongoDB();

  try {
    const {
      name,
      method_type,
      description,
      api_endpoint,
      channel_id,
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    } = await req.json();

    if (!name || !method_type || !api_endpoint || !channel_id || !keywords) {
      return formatResponse(400, { message: "Invalid input." });
    }

    const existingChannel = await Channel.findById(channel_id);
    console.log("existingChannel", existingChannel);
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    const newAPI = new API({
      name,
      method_type,
      description,
      api_endpoint,
      channel_id: new mongoose.Types.ObjectId(channel_id),
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    });

    const savedAPI = await newAPI.save();

    return formatResponse(201, { API: savedAPI });
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
      method_type,
      description,
      api_endpoint,
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    } = body;

    if (!id) {
      return formatResponse(400, { message: "Please provide API ID." });
    }

    const existingAPI = await API.findById(id);
    if (!existingAPI) {
      return formatResponse(404, { message: "API not found." });
    }

    const existingChannel = await Channel.findById(
      existingAPI.channel_id.toString()
    );

    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }
    const updatedAPI = await API.findByIdAndUpdate(
      id,
      {
        name,
        method_type,
        description,
        api_endpoint,
        api_params,
        api_headers,
        api_body,
        api_auth,
        keywords,
      },
      {
        new: true,
      }
    );

    if (!updatedAPI) {
      return formatResponse(404, { message: "API not found." });
    }

    return formatResponse(200, { API: updatedAPI });
  } catch (error) {
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
      return formatResponse(400, { message: "Please provide API ID." });
    }

    const existingAPI = await API.findById(id);
    if (!existingAPI) {
      return formatResponse(404, { message: "API not found." });
    }
    const existingChannel = await Channel.findById(
      existingAPI.channel_id.toString()
    );
    if (!existingChannel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    await API.findByIdAndDelete(id);

    return formatResponse(200, { message: "Success delete API!!" });
  } catch (error) {
    return formatResponse(500, { message: "Internal server error." });
  }
}
