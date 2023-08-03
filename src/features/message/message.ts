import { MessagesResponse, Message } from "./type";

const pageSize = 10;

const messages: Message[] = [
  { id: "m/-10", text: "メッセージ -10" },
  { id: "m/-9", text: "メッセージ -9" },
  { id: "m/-8", text: "メッセージ -8" },
  { id: "m/-7", text: "メッセージ -7" },
  { id: "m/-6", text: "メッセージ -6" },
  { id: "m/-5", text: "メッセージ -5" },
  { id: "m/-4", text: "メッセージ -4" },
  { id: "m/-3", text: "メッセージ -3" },
  { id: "m/-2", text: "メッセージ -2" },
  { id: "m/-1", text: "メッセージ -1" },
  { id: "m/0", text: "メッセージ 0" },
  { id: "m/1", text: "メッセージ 1" },
  { id: "m/2", text: "メッセージ 2" },
  { id: "m/3", text: "メッセージ 3" },
  { id: "m/4", text: "メッセージ 4" },
  { id: "m/5", text: "メッセージ 5" },
  { id: "m/6", text: "メッセージ 6" },
  { id: "m/7", text: "メッセージ 7" },
  { id: "m/8", text: "メッセージ 8" },
  { id: "m/9", text: "メッセージ 9" },
  { id: "m/10", text: "メッセージ 10" },
  { id: "m/11", text: "メッセージ 11" },
  { id: "m/12", text: "メッセージ 12" },
  { id: "m/13", text: "メッセージ 13" },
  { id: "m/14", text: "メッセージ 14" },
  { id: "m/15", text: "メッセージ 15" },
  { id: "m/16", text: "メッセージ 16" },
  { id: "m/17", text: "メッセージ 17" },
  { id: "m/18", text: "メッセージ 18" },
  { id: "m/19", text: "メッセージ 19" },
];

export const getMessagesByNextCursor = (
  cursor: string = "m/0",
): MessagesResponse => {
  const startIndex = messages.findIndex((m) => m.id === cursor);
  if (startIndex < 0) {
    return {
      data: [],
      nextCursor: null,
      prevCursor: null,
    };
  }

  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  const lastIndex = startIndex + pageSize;
  const pageData = messages.slice(startIndex, lastIndex);

  const nextMessage = messages[lastIndex];
  if (nextMessage) {
    nextCursor = nextMessage.id;
  }

  const prevMessage = messages[startIndex - 1];
  if (prevMessage) {
    prevCursor = prevMessage.id;
  }

  return {
    data: pageData,
    nextCursor,
    prevCursor,
  };
};

export const getMessagesByPrevCursor = (cursor: string): MessagesResponse => {
  const cursorIndex = messages.findIndex((m) => m.id === cursor);
  if (cursorIndex < 0) {
    return {
      data: [],
      nextCursor: null,
      prevCursor: null,
    };
  }

  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  const startIndex = cursorIndex - (pageSize - 1);
  const lastIndex = startIndex + pageSize;
  const pageData = messages.slice(startIndex, lastIndex);

  const nextMessage = messages[lastIndex];
  if (nextMessage) {
    nextCursor = nextMessage.id;
  }

  const prevMessage = messages[startIndex - 1];
  if (prevMessage) {
    prevCursor = prevMessage.id;
  }

  return {
    data: pageData,
    nextCursor,
    prevCursor,
  };
};

export const appendMessages = () => {
  const last = messages.at(-1);
  if (!last) {
    return undefined;
  }

  const newMessages = Array.from({ length: pageSize }).map((_, i) => {
    return {
      id: crypto.randomUUID(),
      text: `Newメッセージ ${i}`,
    };
  });

  messages.push(...newMessages);

  return newMessages[0].id;
};
