// import type { NextApiRequest, NextApiResponse } from "next";
// import Cors from "cors";

// const cors = Cors({
//   methods: ["GET", "HEAD"],
// });

// function runMiddleware(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   fn: Function
// ) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

// export default async function corsMiddleware(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await runMiddleware(req, res, cors);
// }

// import { NextRequest, NextResponse } from "next/server";

// const allowedOrigins = [
//   "http://localhost:3000",
//   process.env.NEXT_PUBLIC_API_URL,
// ].filter(Boolean);

// export function corsMiddleware(request: NextRequest) {
//   const origin = request.headers.get("origin");

//   if (origin && allowedOrigins.includes(origin)) {
//     const response = NextResponse.next();

//     response.headers.set("Access-Control-Allow-Origin", origin);
//     response.headers.set(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     response.headers.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     response.headers.set("Access-Control-Max-Age", "86400");

//     return response;
//   }

//   return NextResponse.next();
// }

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
console.log("Allowed origins:", allowedOrigins);
