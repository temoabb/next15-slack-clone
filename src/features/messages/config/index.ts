import { Id, TableNames } from "../../../../convex/_generated/dataModel";

type PreviewBase<T extends TableNames> = {
  id: Id<T>;
  name: string;
  type: T;
};

export type MemberPreview = PreviewBase<"members"> & { image?: string };
export type ChannelPreview = PreviewBase<"channels">;

export type Preview = MemberPreview | ChannelPreview;
