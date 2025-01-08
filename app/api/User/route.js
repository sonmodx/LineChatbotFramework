import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";
import { formatResponse } from "@/lib/utils";
import Audience from "@/models/audience";

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
      const Line_User = await LineUser.findById(id);
      if (!Line_User) {
        return formatResponse(404, { message: "User not found." });
      }
      const channel = await Channel.findById(Line_User.channel_id.toString());
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      return formatResponse(200, { user: Line_User });
    } else {
      const channels = await Channel.findById(channel_id);
      if (!channels) {
        return formatResponse(404, { message: "Channel not found." });
      }

      if (
        session.user._id &&
        session.user._id.toString() !== channels.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access to this Channel" });
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

      const totalLine_Users = await LineUser.countDocuments(filter);

      const Line_Users = await LineUser.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      // Map users to include audience descriptions
      const allAudiences = await Audience.find(); // Get all Audience documents at once
      console.log("server all aud", allAudiences);
      const usersWithAudience = Line_Users.map((user) => {
        // Find all matching Audience records for the user's line_user_id in the audiences array
        console.log("server match line user", user);
        const matchedAudiences = allAudiences.filter(
          (aud) => aud.audiences.includes(user.line_user_id) // Check if the line_user_id exists in the audiences array
        );

        console.log("server match aud", matchedAudiences);

        // Extract the `description` field from the matched Audience records
        const audienceDescriptions = matchedAudiences.map(
          (aud) => aud.description
        );

        return {
          ...user.toObject(), // Use `toObject` for mongoose docs to avoid serialization issues
          audience: audienceDescriptions.join(", "), // Attach audience descriptions
        };
      });

      return formatResponse(200, {
        user: usersWithAudience,
        Total: totalLine_Users,
      });
    }
  } catch (error) {
    console.log(error);
    return formatResponse(500, { message: error.message });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
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
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    const existingLineUser = await LineUser.find({ channel_id: channel_id });

    // if existingLineUser have this _id then return error  400
    if (
      existingLineUser &&
      existingLineUser.length > 0 &&
      existingLineUser.find((user) => user._id.toString() === _id)
    ) {
      return formatResponse(400, { message: "User already exists" });
    }

    if (!_id || !name || !display_name) {
      return formatResponse(400, {
        message: "Please provide name and display_name",
      });
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
      return formatResponse(404, { message: "User not found." });
    }

    return formatResponse(201, { user: savedUser });
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return formatResponse(401, { message: "Unauthorized" });
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
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    const Line_User = await LineUser.findById(_id);
    if (!Line_User) {
      return formatResponse(404, { message: "User not found." });
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
      return formatResponse(404, { message: "User not found." });
    }

    return formatResponse(200, { user: updatedUser });
  } catch (error) {
    return formatResponse(500, { message: error.message });
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
    const existingLineUser = await LineUser.findById(id);
    if (!existingLineUser) {
      return formatResponse(404, { message: "User not found." });
    }
    const channel = await Channel.findById(
      existingLineUser.channel_id.toString()
    );
    if (!channel) {
      return formatResponse(404, { message: "Channel not found." });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== channel.user_id.toString()
    ) {
      return formatResponse(400, { message: "No access this Channel" });
    }

    await LineUser.findByIdAndDelete(id);

    return formatResponse(200, {
      message: "Success delete user!!",
    });
  } catch (error) {
    return formatResponse(500, { message: error.message });
  }
}
