import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("members"), // Id who we are trying to chat  (string from useParams '/memberId')
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unaithorized");

    // Only members within the workspace will be able to create these types of conversations:
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique(); // This is us

    // Question: Is this check below enough?
    // How do we have a guarantee, that the other member belongs to this particular workspace too?
    const otherMember = await ctx.db.get(args.memberId);

    if (
      !currentMember ||
      !otherMember ||
      otherMember.workspaceId !== args.workspaceId // Third check was added by me
    )
      throw new Error("Member not found");

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          // Two scenario depends  who initiated the conversation:
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) return existingConversation._id;

    const conversationId = await ctx.db.insert("conversations", {
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
      workspaceId: args.workspaceId,
    });

    if (!conversationId) throw new Error("Conversation not found");

    return conversationId;
  },
});
