import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    // Return all possible workspaces:
    return await ctx.db.query("workspaces").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId)
      throw new Error("Unauthorized user is trying to create a new workspace");

    // TODO: create a proper method later
    const joinCode = "123456";

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    // const workspace = await ctx.db.get(workspaceId);
    return workspaceId;
  },
});
