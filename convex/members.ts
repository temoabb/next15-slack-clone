import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  const user = await ctx.db.get(id);
  return user;
};

export const getAll = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const allMembersInWorkspace = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    let members = [];

    for (const member of allMembersInWorkspace) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    return members;
  },
});

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    return member;
  },
});
