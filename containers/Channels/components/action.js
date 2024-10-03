"use server";
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
      "asd",
      JSON.stringify({ endpoint: endpoint })
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
}
