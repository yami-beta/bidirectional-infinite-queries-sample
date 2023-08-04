"use client";

import { useMutation } from "@tanstack/react-query";
import { useMessages } from "./useMessages";

export function PageContent() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useMessages();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await fetch("/api/messages", {
        method: "POST",
      }).then((res) => res.json());

      return result as { nextCursor: string | null };
    },
  });

  return (
    <div>
      <p>useInfiniteQueryを用いたデモ実装です</p>

      <div>
        <button
          disabled={!hasPreviousPage}
          onClick={() => {
            fetchPreviousPage();
          }}
        >
          前を読み込む
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => {
            fetchNextPage();
          }}
        >
          次を読み込む
        </button>
        <button
          onClick={async () => {
            const result = await mutation.mutateAsync();
            if (!result.nextCursor) {
              return;
            }

            // ここは引数の pageParam に型がつかないので useMessages 内部で関数を定義して返す方が良い
            fetchNextPage({ pageParam: { nextCursor: result.nextCursor } });
          }}
        >
          10件追加しnextCursorを更新
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <div>
          <h2>データ</h2>
          <pre>{JSON.stringify(data, null, "  ")}</pre>
        </div>
      </div>
    </div>
  );
}
