import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import Message from "@/models/message";

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
        const message = await Message.findById(id);
        if (!message) {
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
            Message: message,
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
    
        const messages = await Message.find({
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
            Messages: messages,
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
      text_message,
      list_user,
      keyword,
    } = await req.json();

    if (action_type === "reply message") {
      if (
        !name ||
        !type ||
        !channel_id ||
        !text_message ||
        !list_user ||
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
      const newMessage = new Message({
        name,
        type,
        description,
        channel_id: mongoose.Types.ObjectId(channel_id),
        text_message,
        list_user,
        keyword,
      });

      const savedMsg = await newMessage.save();

      // sent request to webhook for working with message
      /////////////////////////////////////////////////

      return new Response(
        JSON.stringify({
          status: {
            code: 201,
            description: "Created",
          },
          Message: savedMsg,
        }),
        {
          status: 201,
        }
      );
    } else if(action_type === "broadcast message") {
      // code for broadcast message
    } else if(action_type === "push message") {
      // code for send message
    } else if(action_type === "multicast message") {
      // code for multicast message
    } else if(action_type === "Narrowcast message") {
      // code for Narrowcast message
    } else if(action_type === "greeting message") {
      // code for greeting message
    } else if(action_type === "rich menu") {
        // code for rich menu
    }
    else {
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
    const { name, type, description, channel_id, text_message, list_user, keyword } = await req.json();

    const message = await Message.findById(id);
    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found." }), {
        status: 404,
      });
    }

    if (session.user._id && session.user._id.toString() !== message.list_user.toString()) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    message.name = name;
    message.type = type;
    message.description = description;
    message.channel_id = channel_id;
    message.text_message = text_message;
    message.list_user = list_user;
    message.keyword = keyword;

    const updatedMessage = await message.save();

    return new Response(
        JSON.stringify({
            status: {
            code: 200,
            description: "OK",
            },
            Message: updatedMessage,
        }),
        {
            status: 200,
        }
        );
    }
    catch (error) {
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
    
        const message = await Message.findById(id);
        if (!message) {
        return new Response(JSON.stringify({ message: "Message not found." }), {
            status: 404,
        });
        }
    
        if (session.user._id && session.user._id.toString() !== message.list_user.toString()) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
        }
    
        await message.delete();
    
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
