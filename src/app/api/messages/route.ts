import { NextResponse } from "next/server";
import {
  appendMessages,
  getMessagesByNextCursor,
  getMessagesByPrevCursor,
} from "../../../features/message/message";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const prevCursor = url.searchParams.get("prev");

  if (typeof prevCursor === "string") {
    const res = getMessagesByPrevCursor(prevCursor);
    return NextResponse.json(res);
  }

  const nextCursor = url.searchParams.get("next") ?? undefined;
  const res = getMessagesByNextCursor(nextCursor);

  return NextResponse.json(res);
}

export async function POST() {
  const nextCursor = appendMessages();

  return NextResponse.json({
    nextCursor: nextCursor ?? null,
  });
}
