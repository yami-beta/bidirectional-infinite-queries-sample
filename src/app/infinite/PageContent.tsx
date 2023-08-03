"use client";

import useSWRMutation from "swr/mutation";
import { useMessages } from "./useMessages";

export function PageContent() {
  const { next, prev, data } = useMessages();

  const { trigger } = useSWRMutation("/api/messages", async () => {
    const result = await fetch("/api/messages", {
      method: "POST",
    }).then((res) => res.json());

    return result as { nextCursor: string | null };
  });

  return (
    <div>
      <p>
        新しいデータと古いデータのそれぞれでuseSWRInfiniteを使い双方向ページネーションを行うデモです
      </p>
      <div>
        <button
          disabled={
            prev.data &&
            prev.data.length > 0 &&
            typeof prev.data[prev.data.length - 1].prevCursor !== "string"
          }
          onClick={() => {
            prev.setSize((prev) => prev + 1);
          }}
        >
          前を読み込む
        </button>
        <button
          disabled={
            next.data &&
            typeof next.data[next.data.length - 1].nextCursor !== "string"
          }
          onClick={() => {
            next.setSize((prev) => prev + 1);
          }}
        >
          次を読み込む
        </button>
        <button
          onClick={() => {
            prev.setSize(0);
            prev.mutate();
            next.setSize(1);
            next.mutate();
          }}
        >
          1ページから再取得
        </button>
        <button
          onClick={async () => {
            const result = await trigger();
            if (!result.nextCursor) {
              return;
            }

            next.mutate(
              (previousData) => {
                if (!previousData) {
                  return previousData;
                }

                const lastPage = previousData[previousData.length - 1];

                const updated = {
                  ...lastPage,
                  nextCursor: result.nextCursor,
                };

                return [
                  ...previousData.slice(0, previousData.length - 1),
                  updated,
                ];
              },
              {
                revalidate: false,
              },
            );
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
          <h2>next: {next.size}</h2>
          <pre>{JSON.stringify(next.data, null, "  ")}</pre>
        </div>

        <div>
          <h2>prev: {prev.size}</h2>
          <pre>{JSON.stringify(prev.data, null, "  ")}</pre>
        </div>

        <div>
          <h2>結合データ</h2>
          <pre>{JSON.stringify(data, null, "  ")}</pre>
        </div>
      </div>
    </div>
  );
}
