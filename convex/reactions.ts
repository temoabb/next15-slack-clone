import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";

// 'getMember' is a combination of user and workspace ids. This is a difference between populating and getting a member.

const getMember = async ({
  ctx,
  userId,
  workspaceId,
}: {
  ctx: QueryCtx;
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
}) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);

    if (!message) throw new Error("Message not found");

    const member = await getMember({
      ctx,
      userId,
      workspaceId: message.workspaceId,
    });

    // Anyone can add a reaction to any message, so we WON'T check if the member is an author of the message:
    if (!member) throw new Error("Unauthorized");

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) => {
        return q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        );
      })
      .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);

      return existingMessageReactionFromUser._id;
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        memberId: member._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });

      return newReactionId;
    }
  },
});
