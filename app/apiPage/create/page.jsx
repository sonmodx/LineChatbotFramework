import ApiSetting from "@/components/apisetting";

export default function Page({ searchParams }) {
  return <ApiSetting channelId={searchParams.channel_id} />;
}
