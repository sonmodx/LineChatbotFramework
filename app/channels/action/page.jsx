import ActionEdit from "@/containers/ChannelAction/ActionEdit";

export default function Page({ searchParams }) {
  const id = searchParams?.id; // Get the value of the 'id' query parameter

  return <ActionEdit id={id} />;
}
