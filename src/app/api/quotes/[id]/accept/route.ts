import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // In production: verify auth, validate company_id matches, update Supabase
  // PATCH /api/quotes/[id]/accept
  return NextResponse.json({
    data: { id, status: "accepted" },
    message: "Quote accepted successfully",
  });
}
