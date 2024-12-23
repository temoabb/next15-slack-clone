import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // Not throwing an error in the queries (unlike mutations).

    // For queries we can catch errors only in error boundaries so throwing an error here would not be a good solution.

    // Instead we'll return an empty array:
    if (!userId) return [];

    // Find all workspaces this user is a member of:

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const id of workspaceIds) {
      const workspace = await ctx.db.get(id);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    // return await ctx.db.query("workspaces").collect();
    return workspaces;
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
    const joinCode = generateCode();

    // If we are the user that created a workspace, it will be correct to assume that we are the admin and the member of that workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    // const workspace = await ctx.db.get(workspaceId);
    return workspaceId;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      // TODO: refactor, temporarily hidden because of hydration error

      // throw new Error("Unauthorized user is trying to get a workspace details");
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    // TODO: only members of the workspace can fetch its information

    if (!member) return null;

    // return await ctx.db.get(args.id);

    const workspace = await ctx.db.get(args.id);
    return workspace;
  },
});
