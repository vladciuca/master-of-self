import { NextRequest } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_API_URL,
].filter(Boolean);

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const headers = new Headers();

  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.set("Access-Control-Max-Age", "86400");
  }

  return headers;
}

// For debugging purposes, you can log the allowed origins:
// console.log("Allowed origins:", allowedOrigins);
