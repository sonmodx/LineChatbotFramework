import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import Action from "@/models/action";

// method get
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
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "name";
    const orderDirection =
      searchParams.get("orderDirection") === "desc" ? -1 : 1;
    const pageNumber = parseInt(searchParams.get("pageNumber")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    if (id) {
      const action = await Action.findById(id);
      if (!action) {
        return new Response(JSON.stringify({ message: "Message not found." }), {
          status: 404,
        });
      }

      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          Action: action,
        }),
        {
          status: 200,
        }
      );
    } else {
      if (!session.user._id) {
        return new Response(
          JSON.stringify({
            status: {
              code: 400,
              description: "Bad Request",
            },
            message: "Missing required fields.",
          }),
          {
            status: 400,
          }
        );
      }

      const actions = await Action.find({
        list_user: session.user._id,
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
          Actions: actions,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// method post
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
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
        return new Response(
          JSON.stringify({
            status: {
              code: 400,
              description: "Bad Request",
            },
            message: "Missing required fields.",
          }),
          {
            status: 400,
          }
        );
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

      return new Response(
        JSON.stringify({
          status: {
            code: 201,
            description: "Created",
          },
          Action: savedAction,
        }),
        {
          status: 201,
        }
      );
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
      return new Response(
        JSON.stringify({
          status: {
            code: 400,
            description: "Bad Request",
          },
          message: "Invalid action type.",
        }),
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// method put
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
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
      return new Response(JSON.stringify({ message: "Message not found." }), {
        status: 404,
      });
    }

    if (
      session.user._id &&
      session.user._id.toString() !== message.list_user.toString()
    ) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
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

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "OK",
        },
        Action: updatedAction,
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

// method delete
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  await connectMongoDB();

  try {
    const { id } = new URL(req.url);

    const action = await Action.findById(id);
    if (!action) {
      return new Response(JSON.stringify({ message: "Message not found." }), {
        status: 404,
      });
    }

    if (
      session.user._id &&
      session.user._id.toString() !== message.list_user.toString()
    ) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await action.delete();

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "OK",
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
