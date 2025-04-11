import { AuctionsByCategory } from "@/components";
import { searchProps } from "@/interfaces";

export default async function AboutPage(props: searchProps) {
  const searchParams = await props.searchParams;

  return (
    <AuctionsByCategory
      searchParams={searchParams}
      slug="horse-classifieds"
      title="HORSE CLASSIFIEDS"
    />
  );
}
