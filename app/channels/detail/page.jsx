import ChannelDetail from "@/containers/ChannelDetail";

export default function Page({ searchParams }) {
  return (
    <ChannelDetail
      id={searchParams.id}
      channelName={searchParams.channelName}
    />
  );
}
