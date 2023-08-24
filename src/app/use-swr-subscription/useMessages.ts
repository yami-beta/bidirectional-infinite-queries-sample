import { eventmit } from "eventmit";
import { useCallback, useMemo } from "react";
import useSWRSubscription from "swr/subscription";
import { MessagesResponse } from "../../features/message/type";

const endpoint = "/api/messages";

export const useMessages = () => {
  const nextEvent = useMemo(() => eventmit<{ cursor: string }>(), []);
  const prevEvent = useMemo(() => eventmit<{ cursor: string }>(), []);

  const result = useSWRSubscription({ endpoint }, (args, { next }) => {
    fetch(args.endpoint)
      .then((res) => res.json())
      .then((d: MessagesResponse) => {
        next(null, d);
      });

    nextEvent.on((value) => {
      fetch(`${args.endpoint}?next=${value.cursor}`)
        .then((res) => res.json())
        .then((d: MessagesResponse) => {
          next(null, (prev: MessagesResponse) => {
            return {
              ...prev,
              data: [...prev.data, ...d.data],
              nextCursor: d.nextCursor,
            };
          });
        });
    });

    prevEvent.on((value) => {
      fetch(`${args.endpoint}?prev=${value.cursor}`)
        .then((res) => res.json())
        .then((d: MessagesResponse) => {
          next(null, (prev: MessagesResponse) => {
            return {
              ...prev,
              data: [...d.data, ...prev.data],
              prevCursor: d.prevCursor,
            };
          });
        });
    });

    return () => {
      nextEvent.offAll();
    };
  });

  const fetchNextPage = useCallback(
    (cursor: string) => {
      nextEvent.emit({ cursor });
    },
    [nextEvent],
  );

  const fetchPrevPage = useCallback(
    (cursor: string) => {
      prevEvent.emit({ cursor });
    },
    [prevEvent],
  );

  return { ...result, fetchNextPage, fetchPrevPage };
};
