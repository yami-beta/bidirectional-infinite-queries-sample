import { QueryFunction, useInfiniteQuery } from "@tanstack/react-query";
import { MessagesResponse } from "../../features/message/type";

const endpoint = "/api/messages" as const;

export const useMessages = () => {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) {
        return undefined;
      }

      return {
        nextCursor: lastPage.nextCursor,
        prevCursor: undefined,
      };
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.prevCursor) {
        return undefined;
      }

      return {
        nextCursor: undefined,
        prevCursor: firstPage.prevCursor,
      };
    },
  });
};

const fetchMessages: QueryFunction<
  MessagesResponse,
  string[],
  { nextCursor: string | undefined; prevCursor: string | undefined }
> = async ({ pageParam }) => {
  const searchParams = new URLSearchParams();
  if (pageParam?.nextCursor) {
    searchParams.set("next", pageParam.nextCursor);
  }
  if (pageParam?.prevCursor) {
    searchParams.set("prev", pageParam.prevCursor);
  }

  const result = await fetch(`${endpoint}?${searchParams.toString()}`).then(
    (res) => res.json(),
  );

  return result as MessagesResponse;
};
