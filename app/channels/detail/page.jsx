import ChannelDetail from "@/containers/ChannelDetail";

export default function Page({ searchParams }) {
  return (
    <ChannelDetail
      id={searchParams.id}
      channelId={searchParams.channel_id}
      channelName={searchParams.channelName}
    />
  );
}
