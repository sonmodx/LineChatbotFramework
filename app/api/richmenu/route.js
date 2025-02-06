import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import LineUser from "@/models/LineUser";
import mongoose from "mongoose";
import { formatResponse } from "@/lib/utils";
import Richmenu from "@/models/richmenu";

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
      const LineRichmenu = await Richmenu.findById(id);
      if (!LineRichmenu) {
        return formatResponse(404, { message: "Richmenu not found." });
      }
      const channel = await Channel.findById(
        LineRichmenu.channel_id.toString()
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

      return formatResponse(200, { Richmenu: LineRichmenu });
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
          ],
        }),
      };

      const totalRichmenu = await Richmenu.countDocuments(filter);

      const LineRichmenu = await Richmenu.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      // Add the volume field by calculating the length of the Richmenu array for each document
      const RichmenuWithVolume = LineRichmenu.map((RichmenuDoc) => ({
        ...RichmenuDoc.toObject(), // Convert to plain object to allow modifications
        volume: RichmenuDoc.Richmenus ? RichmenuDoc.Richmenus.length : 0, // Add volume field
      }));

      return formatResponse(200, {
        Richmenu: RichmenuWithVolume,
        Total: totalRichmenu,
      });
    }
  } catch (error) {
    console.log(error);
    return formatResponse(500, { message: error.message });
  }
}