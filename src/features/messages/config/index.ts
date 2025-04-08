import { Doc, Id, TableNames } from "../../../../convex/_generated/dataModel";

type PreviewBase<T extends TableNames> = {
  id: Id<T>;
  name: string;
  type: T;
};

export type MemberPreview = PreviewBase<"members"> & { image?: string };
export type ChannelPreview = PreviewBase<"channels">;

export type Preview = MemberPreview | ChannelPreview;

// TODO: Refactor code
export type ForwardedMessageProps = {
  id: Id<"messages">;
  body?: string;
  image?: Id<"_storage">;

  author: {
    memberId: Id<"members">;
    name: string;
    image?: string;
    role: Doc<"members">["role"];
  };

  origin: {
    id: Id<"channels"> | Id<"conversations">;
    type: "channels" | "conversations";
    name: string;
  };

  _creationTime: number;
  updatedAt?: number;
};
