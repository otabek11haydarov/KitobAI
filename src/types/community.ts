export type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
};

export type Discussion = {
  id: number | string;
  user: string;
  book: string;
  content: string;
  replies: number;
};
