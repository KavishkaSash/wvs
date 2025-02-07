import { apiClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const response = await apiClient({
      url: `/sale-order-lines?sale_order_id=${id}`,
      method: "GET",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Weight headers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight headers" },
      { status: 500 }
    );
  }
}
