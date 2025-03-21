import "server-only";
import SpecificListing from "./specificListing";
import { notFound } from "next/navigation";

type Params = Promise<{ listingid: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SpecificListingPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const { listingid } = params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${apiUrl}/api/listings`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const listings = await response.json();

    // Find the specific listing by ID
    const listingData = listings.find(
      (listing: { id: string }) => listing.id === listingid
    );

    if (!listingData) {
      return notFound();
    }

    return <SpecificListing listingData={listingData} />;
  } catch (error) {
    console.error("Failed to fetch listing data:", error);
    return <div>Error fetching data</div>;
  }
}
