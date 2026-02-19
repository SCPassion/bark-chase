import { NextResponse } from "next/server";

function countryNameFromCode(code: string): string {
  try {
    const display = new Intl.DisplayNames(["en"], { type: "region" });
    return display.of(code) ?? code;
  } catch {
    return code;
  }
}

export async function GET(request: Request) {
  const countryCode = request.headers.get("x-vercel-ip-country") ?? "";
  if (!countryCode) {
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const normalizedCode = countryCode.toUpperCase();
  return NextResponse.json(
    {
      countryCode: normalizedCode,
      countryName: countryNameFromCode(normalizedCode),
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
