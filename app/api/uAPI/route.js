import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import API from "@/models/API"
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
        return new Response(JSON.stringify({ message: "Channel not found." }), {
          status: 404,
        });
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
      const apis = await Channel.find(filter)
        .sort({ [orderBy]: orderDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
      return new Response(
        JSON.stringify({
          status: {
            code: 200,
            description: "OK",
          },
          API: apis,
          Total: apis.length,
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
    console.log(name,
      method_type,
      description,
      api_endpoint,
      channel_id,
      api_params,
      api_headers,
      api_body,
      api_auth,
      keywords);

    if (!name || !method_type || !api_endpoint || !channel_id || !keywords) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
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
    console.log("newAPI", newAPI);
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
    const { id, ...updateData } = body;
    if (!id) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    // const {
    //   name,
    //   method_type,
    //   description,
    //   api_endpoint,
    //   channel_id,
    //   api_params,
    //   api_headers,
    //   api_body,
    //   api_auth,
    //   keywords,
    // } = await req.json();

    // if (!name || !method_type || !api_endpoint || !channel_id || !keywords) {
    //   return new Response(JSON.stringify({ message: "API not found." }), {
    //     status: 404,
    //   });
    // }

    // const updatedAPI = await API.findByIdAndUpdate(id, {
    //   name,
    //   method_type,
    //   description,
    //   api_endpoint,
    //   channel_id: new mongoose.Types.ObjectId(channel_id),
    //   api_params,
    //   api_headers,
    //   api_body,
    //   api_auth,
    //   keywords,
    // }, {
    //   new: true,
    // });

    const updatedAPI = await API.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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
    const { id } = await req.json();
    const api = await API.findById(id);

    if (!api) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

    const deletedAPI = await API.findByIdAndDelete(id);

    if (!deletedAPI) {
      return new Response(JSON.stringify({ message: "API not found." }), {
        status: 404,
      });
    }

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