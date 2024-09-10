import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Channel from "@/models/channel";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    // const user_id = searchParams.get("user_id");
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "name";
    const orderDirection =
      searchParams.get("orderDirection") === "desc" ? -1 : 1;
    const pageNumber = parseInt(searchParams.get("pageNumber")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    if (id) {
      const channel = await Channel.findById(id);
      if (!channel) {
        return new Response(JSON.stringify({ message: "Channel not found." }), {
          status: 404,
        });
      }

      if (channel.user_id.toString() !== session.user._id.toString()) {
        return new Response(
          JSON.stringify({
            message:
              "Unauthorized: You do not have permission to access this channel.",
          }),
          {
            status: 403, // Forbidden status code
          }
        );
      }

      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          Channel: channel,
        }),
        {
          status: 200,
        }
      );
    } else {
      if (!session.user._id) {
        return new Response(
          JSON.stringify({ message: "the user hasn't access to it." }),
          { status: 400 }
        );
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

      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          Channel: channels,
          Total: totalChannels,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
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
    } = body;

    if (
      !name ||
      !webhook_url ||
      !channel_id ||
      !channel_secret ||
      !channel_access_token
    ) {
      return new Response(
        JSON.stringify({ message: "Please provide all required fields." }),
        { status: 400 }
      );
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
    });

    const savedChannel = await newChannel.save();
    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success create channel!!",
        },
        Channel: savedChannel,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
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
    } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Please provide channel ID." }),
        { status: 400 }
      );
    }

    // check if the channel exists and the user has access to it
    const existingChannel = await Channel.findById(id);
    if (!existingChannel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (session.user._id && session.user._id.toString() !== existingChannel.user_id.toString()) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    const updateData = {
      name,
      description,
      webhook_url,
      status,
      channel_id,
      channel_secret,
      channel_access_token,
    };

    const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success update channel!!",
        },
        Channel: updatedChannel,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Please provide channel ID." }),
        { status: 400 }
      );
    }

    // check if the channel exists and the user has access to it
    const existingChannel = await Channel.findById(id);
    if (!existingChannel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (session.user._id && session.user._id.toString() !== existingChannel.user_id.toString()) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    await Channel.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Channel deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}
