import useSWRInfinite from "swr/infinite";
import { MessagesResponse } from "../../features/message/type";

const endpoint = "/api/messages";

export const useMessages = () => {
  const next = useSWRInfinite<MessagesResponse, Error>(
    (pageIndex, previousPageData) => {
      console.log(pageIndex, previousPageData);
      // 最後に到達した
      if (previousPageData && !previousPageData.nextCursor) {
        return null;
      }

      // 最初のページでは、`previousPageData` がありません
      if (pageIndex === 0) {
        return [`${endpoint}`, "next"];
      }

      // API のエンドポイントにカーソルを追加します
      return [`${endpoint}?next=${previousPageData?.nextCursor}`, "next"];
    },
    async ([endpoint]) => {
      const result = await fetch(endpoint).then((res) => res.json());
      return result as MessagesResponse;
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const prev = useSWRInfinite<MessagesResponse, Error>(
    (pageIndex, previousPageData) => {
      // 最後に到達した
      if (previousPageData && !previousPageData.prevCursor) {
        return null;
      }

      if (!next.data?.[0]) {
        return null;
      }

      // 最初のページでは、`previousPageData` がありません
      if (pageIndex === 0) {
        return [`${endpoint}?prev=${next.data[0].prevCursor}`, "prev"];
      }

      // API のエンドポイントにカーソルを追加します
      return [`${endpoint}?prev=${previousPageData?.prevCursor}`, "prev"];
    },
    async ([endpoint]) => {
      const result = await fetch(endpoint).then((res) => res.json());
      return result as MessagesResponse;
    },
    {
      initialSize: 0,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const data = [
    ...(prev.data?.reverse().flatMap((d) => d.data) ?? []),
    ...(next.data?.flatMap((d) => d.data) ?? []),
  ];

  return {
    next,
    prev,
    data,
  };
};
