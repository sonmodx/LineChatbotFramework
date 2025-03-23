import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";
import { formatDate, formatResponse } from "@/lib/utils";
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
    const pageSize = parseInt(searchParams.get("pageSize")) || null;

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
      console.log("channel", channels);
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
          (aud) =>
            aud.audiences.includes(user.line_user_id) &&
            aud.channel_id.toString() === channel_id.toString()
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
