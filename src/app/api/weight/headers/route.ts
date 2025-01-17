// app/api/weight/headers/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(baseUrl, token);
    const response = await fetch(`${baseUrl}/weight/headers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weight headers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight headers" },
      { status: 500 }
    );
  }
}
