import { getSearchSuggestions } from "lib/shopify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await getSearchSuggestions(query.trim());
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
