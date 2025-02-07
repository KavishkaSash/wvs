import { apiClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headerId = searchParams.get("id");

    if (!headerId) {
      return NextResponse.json(
        { error: "Header ID is required" },
        { status: 400 }
      );
    }

    const weightLineData = await request.json();
    console.log(headerId);
    // Make the API call to your backend service
    const response = await apiClient({
      url: `/weight/headers/${headerId}/lines`,
      method: "POST",
      data: weightLineData,
    });

    const data = response.data;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weight line creation error:", error);
    return NextResponse.json(
      { error: "Failed to create weight line" },
      { status: 500 }
    );
  }
}
