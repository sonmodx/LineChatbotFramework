import ApiSetting from "@/components/apisetting";

export default function Page({ searchParams }) {
  return <ApiSetting mode="edit" id={searchParams.id} />;
}
