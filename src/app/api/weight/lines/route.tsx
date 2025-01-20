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

    // Make the API call to your backend service
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/weight/headers/${headerId}/lines`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weightLineData),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weight line creation error:", error);
    return NextResponse.json(
      { error: "Failed to create weight line" },
      { status: 500 }
    );
  }
}
