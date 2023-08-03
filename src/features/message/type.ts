export type Message = {
  id: string;
  text: string;
};

export type MessagesResponse = {
  data: Message[];
  nextCursor: string | null;
  prevCursor: string | null;
};
