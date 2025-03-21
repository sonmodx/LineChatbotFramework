"use server";

import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";

const LINE_API = "https://api.line.me/v2/bot";

export async function getBotInfo(token) {
  try {
    const res = await fetch(`${LINE_API}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("GET BOT INFO", data);
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function setWebhookURL(token, endpoint) {
  try {
    const res = await fetch(`${LINE_API}/channel/webhook/endpoint`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint: endpoint }),
    });
    const data = await res.json();
    console.log(
      "PUT Webhook URL",
      data,

      JSON.stringify({ endpoint: endpoint })
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function isDestinationExists(destination) {
  await connectMongoDB();
  try {
    const channel = await Channel.findOne({ destination: destination });
    return !!channel; // Return true if a match is found, otherwise false
  } catch (error) {
    console.error("Error checking destination:", error);
    return false;
  }
}
