import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";
import { formatResponse } from "@/lib/utils";
import Audience from "@/models/audience";
import Log from "@/models/log";

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
      const LineLog = await Log.findById(id);
      if (!LineLog) {
        return formatResponse(404, { message: "Audience not found." });
      }
      const channel = await Channel.findById(LineLog.channel_id.toString());
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      return formatResponse(200, { audience: LineLog });
    } else {
      const channels = await Channel.findById(channel_id);
      if (!channels) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channels.user_id.toString()
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
            { line_user_id: { $elemMatch: { $regex: search, $options: "i" } } },
          ],
        }),
      };

      console.log("log", typeof search);
      console.log("filter", JSON.stringify(filter, null, 2));

      const totalLog = await Log.countDocuments(filter);

      const LineLog = await Log.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      console.log("result log", LineLog);

      // Function to retrieve line_user_name from LineUser collection
      const getLineUserNames = async (lineUserIds) => {
        if (!Array.isArray(lineUserIds)) {
          return [];
        }

        const users = await LineUser.find({
          line_user_id: { $in: lineUserIds },
        });

        // Map the result to return the display names
        const lineUserNames = users.reduce((acc, user) => {
          acc[user.line_user_id] = user.display_name;
          return acc;
        }, {});

        return lineUserIds.map((id) => lineUserNames[id] || "Unknown User");
      };

      // Adding line_user_name and joined content to each log entry
      const logsWithUserNamesAndContent = await Promise.all(
        LineLog.map(async (log) => {
          const lineUserIds = log.line_user_id;

          let line_user_name = "Unknown User";

          // If line_user_id is a string, use the string as line_user_name
          if (typeof lineUserIds === "string") {
            line_user_name = lineUserIds; // Directly use the string value
          }
          // If line_user_id is an array, retrieve names from LineUser collection
          else if (Array.isArray(lineUserIds)) {
            const userNames = await getLineUserNames(lineUserIds);
            line_user_name = userNames.join(", "); // Combine names with comma separator
          }

          // Join the content array with a comma separator if it contains more than 1 value
          const joinedContent = JSON.stringify(log.content, null, 2);

          return {
            ...log.toObject(),
            line_user_name, // Add line_user_name field
            content: joinedContent, // Join content with comma separator
          };
        })
      );

      return formatResponse(200, {
        log: logsWithUserNamesAndContent,
        Total: totalLog,
      });
    }
  } catch (error) {
    console.log(error);
    return formatResponse(500, { message: error.message });
  }
}
