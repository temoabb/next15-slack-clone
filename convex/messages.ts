import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await getMember({
      ctx,
      userId,
      workspaceId: args.workspaceId,
    });

    if (!member) throw new Error("Unauthorized: can not create a message");

    // TODO: Handle conversationId

    let _conversationId = args.conversationId;

    // We will NOT have conversationId come from the frontend in 1:1.
    // We only have other member's id who we are talking to.

    // Only possible if we are replying in a thread in 1:1 conversation:
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) throw new Error("Parent message not found");

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,

      memberId: member._id,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
