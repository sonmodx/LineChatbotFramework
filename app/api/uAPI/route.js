import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import API from "@/models/API";
import Channel from "@/models/channel";
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
      const api = await API.findById(id);
      if (!api) {
        return new Response(JSON.stringify({ message: "API not found." }), {
          status: 404,
        });
      }

      const existingChannel = await Channel.findById(api.channel_id.toString());
      if (!existingChannel) {
        return new Response(JSON.stringify({ message: "Channel not found." }), {
          status: 404,
        });
      }
      if (session.user._id && session.user._id !== existingChannel.user_id) {
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
          API: api,
        }),
        {
          status: 200,
        }
      );
    } else {
      const existingChannel = await Channel.findById(channel_id);
      if (!existingChannel) {
        return new Response(JSON.stringify({ message: "Channel not found." }), {
          status: 404,
        });
      }
      if (
        session.user._id &&
        session.user._id !== existingChannel.user_id.toString()
      ) {
        return new Response(
          JSON.stringify({ message: "No access this Channel" }),
          { status: 400 }
        );
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

      const totalAPIs = await API.countDocuments(filter);

      const apis = await API.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const formattedapis = apis.map((api) => ({
        ...api._doc,
        createdAt: formatDate(new Date(api.createdAt)),
        updatedAt: formatDate(new Date(api.updatedAt)),
      }));

      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          API: formattedapis,
          Total: totalAPIs,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectMongoDB();

  try {
    const {
      name,
      method_type,
      description,
      api_endpoint,
      channel_id,
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    } = await req.json();

    if (!name || !method_type || !api_endpoint || !channel_id || !keywords) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    const existingChannel = await Channel.findById(channel_id);
    console.log("existingChannel", existingChannel);
    if (!existingChannel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    const newAPI = new API({
      name,
      method_type,
      description,
      api_endpoint,
      channel_id: new mongoose.Types.ObjectId(channel_id),
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    });
    const savedAPI = await newAPI.save();
    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success create channel!!",
        },
        API: savedAPI,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An error occurred while registering the API.",
        error: error,
      }),
      { status: 500 }
    );
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
    const body = await req.json();
    const {
      id,
      name,
      method_type,
      description,
      api_endpoint,
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords,
    } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    const existingAPI = await API.findById(id);
    if (!existingAPI) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    const existingChannel = await Channel.findById(
      existingAPI.channel_id.toString()
    );

    if (!existingChannel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }
    const updatedAPI = await API.findByIdAndUpdate(
      id,
      {
        name,
        method_type,
        description,
        api_endpoint,
        api_params,
        api_headers,
        api_body,
        api_auth,
        keywords,
      },
      {
        new: true,
      }
    );

    if (!updatedAPI) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success update API!!",
        },
        API: updatedAPI,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An error occurred while updating the API.",
      }),
      { status: 500 }
    );
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

    if (!id) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    const existingAPI = await API.findById(id);
    if (!existingAPI) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }
    const existingChannel = await Channel.findById(
      existingAPI.channel_id.toString()
    );
    if (!existingChannel) {
      return new Response(JSON.stringify({ message: "Channel not found." }), {
        status: 404,
      });
    }
    if (
      session.user._id &&
      session.user._id.toString() !== existingChannel.user_id.toString()
    ) {
      return new Response(
        JSON.stringify({ message: "No access this Channel" }),
        { status: 400 }
      );
    }

    await API.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({
        status: {
          code: 200,
          description: "Success delete API!!",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An error occurred while deleting the API.",
      }),
      { status: 500 }
    );
  }
}

const formatDate = (date) => {
  // Helper function to pad numbers with leading zeros
  const pad = (num) => (num < 10 ? "0" + num : num);
  const utcOffset = 7 * 60 * 60 * 1000;
  const offsetTime = new Date(date.getTime() + utcOffset);
  // Extracting the individual components of the date
  const day = pad(offsetTime.getUTCDate());
  const month = pad(offsetTime.getUTCMonth() + 1); // Months are zero-indexed
  const year = offsetTime.getUTCFullYear();
  const hours = pad(offsetTime.getUTCHours());
  const minutes = pad(offsetTime.getUTCMinutes());
  const seconds = pad(offsetTime.getUTCSeconds());

  // Formatting date to dd mm yyyy hh:mm:ss
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// const apisWithFormattedDates = apis.map((api) => {
//   // Create a new object to hold the converted dates

//   // List all date fields that need to be converted
//   const dateFields = ["createdAt", "updatedAt", "someOtherDateField"];

//   // Iterate over each date field and convert it if it exists
//   dateFields.forEach((field) => {
//     if (api[field]) {
//       console.log(`Converting ${field}:`, api[field]);
//       const date = new Date(api[field]);
//       const offsetTime = new Date(date.getTime() + utcOffset);
//       console.log(`Converted ${field}:`, offsetTime);
//       api[field] = formatDate(offsetTime);
//       console.log(`Formatted ${field}:`, api[field]);
//     }
//   });

//   return api;
// });
