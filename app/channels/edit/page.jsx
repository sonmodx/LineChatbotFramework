import ChannelEdit from "@/containers/Channels/components/ChannelEdit";

export default function Page({ searchParams }) {
  return <ChannelEdit channelId={searchParams.channel_id} />;
}
