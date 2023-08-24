"use client";

import useSWRMutation from "swr/mutation";
import { useMessages } from "./useMessages";

export function PageContent() {
  const result = useMessages();

  const { trigger } = useSWRMutation("/api/messages", async () => {
    const result = await fetch("/api/messages", {
      method: "POST",
    }).then((res) => res.json());

    return result as { nextCursor: string | null };
  });

  return (
    <div>
      <p>useSWRInfiniteを使い双方向ページネーションを行うデモです</p>
      <button
        onClick={() => {
          result.fetchPrevPage(result.data.prevCursor);
        }}
      >
        Prev
      </button>
      <button
        onClick={() => {
          result.fetchNextPage(result.data.nextCursor);
        }}
      >
        Next
      </button>
      <button
        onClick={async () => {
          const mutateResult = await trigger();
          if (!mutateResult.nextCursor) {
            return;
          }

          result.fetchNextPage(mutateResult.nextCursor);
        }}
      >
        10件を追加しNext取得
      </button>
      <pre>{JSON.stringify(result, null, "  ")}</pre>
    </div>
  );
}
