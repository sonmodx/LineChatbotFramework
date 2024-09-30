import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";

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
    const channel_id = searchParams.get("channel_id");
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "name";
    const orderDirection =
      searchParams.get("orderDirection") === "desc" ? -1 : 1;
    const pageNumber = parseInt(searchParams.get("pageNumber")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    if (id) {
      const Line_User = await LineUser.findById(id);
      const channel = await Channel.findById(Line_User.channel_id.toString());
      if (!channel) {
        return new Response(JSON.stringify({ message: "Channel not found." }), {
          status: 404,
        });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return new Response(
          JSON.stringify({ message: "No access this Channel" }),
          { status: 400 }
        );
      }

      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          user: Line_User,
        }),
        {
          status: 200,
        }
      );
    }
    const channels = await Channel.findbyId(channel_id);
    if (!channels) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channels.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    const Line_Users = await LineUser.find({
      name: { $regex: search, $options: "i" },
    })
      .sort({ [orderBy]: orderDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "OK",
        },
        user: Line_Users,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  // ???
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const channel_id = searchParams.get("channel_id");
    const {
      _id,
      name,
      display_name,
      status_message,
      image_profile,
      email,
      tags,
      groups,
    } = await req.json();
    const channel = await Channel.findById(channel_id);
    if (!channel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    const existingLineUser = await LineUser.find({ channel_id: channel_id });

    // if existingLineUser have this _id then return error  400
    if (
      existingLineUser &&
      existingLineUser.length > 0 &&
      existingLineUser.find((user) => user._id.toString() === _id)
    ) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    if (!_id || !name || !display_name) {
      return new Response(
        JSON.stringify({ message: "Please provide name and display_name" }),
        { status: 400 }
      );
    }

    const Line_User = new LineUser({
      _id: new mongoose.Types.ObjectId(_id),
      name,
      display_name,
      status_message,
      image_profile,
      email,
      tags,
      groups,
      channel_id: new mongoose.Types.ObjectId(channel_id),
    });
    const savedUser = await Line_User.save();

    if (!Line_User) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success create user!!",
        },
        user: savedUser,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
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
    const { searchParams } = new URL(req.url);
    const channel_id = searchParams.get("channel_id");
    const {
      _id,
      name,
      display_name,
      status_message,
      image_profile,
      email,
      tags,
      groups,
    } = await req.json();
    const channel = await Channel.findById(channel_id);
    if (!channel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    const Line_User = await LineUser.findById(_id);
    if (!Line_User) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    const updatedUser = await LineUser.findByIdAndUpdate(
      _id,
      {
        name,
        display_name,
        status_message,
        image_profile,
        email,
        tags,
        groups,
      },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success update user!!",
        },
        user: updatedUser,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
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
    const existingLineUser = await LineUser.findById(id);
    if (!existingLineUser) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }
    const channel = await Channel.findById(
      existingLineUser.channel_id.toString()
    );
    if (!channel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    await LineUser.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success delete user!!",
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
