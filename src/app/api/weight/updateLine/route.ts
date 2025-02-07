// app/api/weight/updateLine/route.ts
import { apiClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
    const response = await apiClient({
      url: "/weight/lines/filter",
      method: "PUT",
      data: {
        id: data.id,
        remark: data.remark,
        status: data.status,
        gross_weight_2: data.weight,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Update line error:", error);
    return NextResponse.json(
      { error: "Failed to update line" },
      { status: 500 }
    );
  }
}
