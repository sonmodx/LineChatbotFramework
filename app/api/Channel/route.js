import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from 'mongoose';
import Channel from '@/models/channel';
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Get a specific channel
      const channel = await Channel.findById(id);
      if (!channel) {
        return new Response(JSON.stringify({ message: 'Channel not found.' }), { status: 404 });
      }
      return new Response(JSON.stringify(channel), { status: 200 });
    } else {
      // Get all channels
      const channels = await Channel.find({});
      return new Response(JSON.stringify(channels), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectMongoDB();

  try {
    const body = await req.json();
    const { name, description, webhook_url, status, user_id, channel_id } = body;

    if (!name || !webhook_url || !status || !user_id || !channel_id) {
      return new Response(JSON.stringify({ message: 'Please provide all required fields.' }), { status: 400 });
    }

    const newChannel = new Channel({
      name,
      description,
      webhook_url,
      status,
      user_id: new mongoose.Types.ObjectId(user_id),
      channel_id,
    });

    const savedChannel = await newChannel.save();
    return new Response(JSON.stringify(savedChannel), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectMongoDB();

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: 'Please provide channel ID.' }), { status: 400 });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedChannel) {
      return new Response(JSON.stringify({ message: 'Channel not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedChannel), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectMongoDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'Please provide channel ID.' }), { status: 400 });
    }

    const deletedChannel = await Channel.findByIdAndDelete(id);

    if (!deletedChannel) {
      return new Response(JSON.stringify({ message: 'Channel not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Channel deleted successfully.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}