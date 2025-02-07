import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";
import { formatDate,formatResponse } from "@/lib/utils";
import Audience from "@/models/audience";
import Log from "@/models/log";

// Helper function to properly format the full date and time
function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  });
}

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
    const pageSize = parseInt(searchParams.get("pageSize")) || null; // Default 10 if null

    if (id) {
      const LineLog = await Log.findById(id).lean();
      if (!LineLog) {
        return formatResponse(404, { message: "Audience not found." });
      }
      const channel = await Channel.findById(LineLog.channel_id.toString()).lean();
      if (!channel) {
        return formatResponse(404, { message: "Channel not found." });
      }
      if (
        session.user._id &&
        session.user._id.toString() !== channel.user_id.toString()
      ) {
        return formatResponse(400, { message: "No access this Channel" });
      }

      return formatResponse(200, { audience: { 
        ...LineLog, 
        createdAt: formatDateTime(LineLog.createdAt),
        updatedAt: formatDateTime(LineLog.updatedAt),
      }});
    } else {
      const channels = await Channel.findById(channel_id).lean();
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
        ...(channel_id && { channel_id: new mongoose.Types.ObjectId(channel_id) }),
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
        .limit(pageSize)
        .lean();

      console.log("result log", LineLog);

      // Function to retrieve line_user_name from LineUser collection
      const getLineUserNames = async (lineUserIds) => {
        if (!Array.isArray(lineUserIds)) {
          return [];
        }

        const users = await LineUser.find({
          line_user_id: { $in: lineUserIds },
        }).lean();

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

          if (typeof lineUserIds === "string") {
            line_user_name = lineUserIds;
          } else if (Array.isArray(lineUserIds)) {
            const userNames = await getLineUserNames(lineUserIds);
            line_user_name = userNames.join(", ");
          }

          const joinedContent = JSON.stringify(log.content, null, 2);

          return {
            ...log, // No need for .toObject() since we used .lean()
            line_user_name,
            content: joinedContent,
            createdAt: formatDateTime(log.createdAt),
            updatedAt: formatDateTime(log.updatedAt),
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
