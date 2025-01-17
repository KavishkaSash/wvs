import { apiClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = [];
  id.push(searchParams.get("id"));
  try {
    const response = await apiClient({
      url: `/weight/headers/${id}/lines`,
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
