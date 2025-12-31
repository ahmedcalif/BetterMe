import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(req: NextRequest) {}, {
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: [
    "/goals/:path*",
    "/archive/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
  ],
};
