import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const populateUser = async (ctx: QueryCtx, id: Id<"users">) => {
  const user = await ctx.db.get(id);
  return user;
};

export const getById = query({
  args: { id: v.id("members") },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    // Member who we are trying to write a dm: ?
    const member = await ctx.db.get(args.id);

    if (!member) return null;

    // This is us: ?
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) return null;

    const user = await populateUser(ctx, member.userId);

    if (!user) return null;

    return {
      user,
      member: { ...member }, // Modified by me: { ...member } -> { member: { ...member } }
    };
  },
});

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

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);

    if (!member) throw new Error("Member not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember || currentMember.role !== "admin")
      throw new Error("Unaithorized");

    await ctx.db.patch(args.id, { role: args.role });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);

    if (!member) throw new Error("Member not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) throw new Error("Unaithorized");

    if (member.role === "admin") throw new Error("Admin can not be removed");

    // If we are trying to remove ourselves and also we have an "admin" role:
    if (currentMember._id === args.id && currentMember.role === "admin")
      throw new Error("Can not remove self if self is an admin");

    // Question: do not we need to add a 'workspaceId' filter in index?
    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),

      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),

      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

// TODO: Add pagination
export const getMembersAndChannels = query({
  args: { workspaceId: v.id("workspaces"), searchText: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const normalizedSearch = args.searchText.toLocaleLowerCase();

    const [allMembers, allChannels] = await Promise.all([
      await ctx.db
        .query("members")
        .withSearchIndex("searchName", (q) =>
          q.search("name", normalizedSearch).eq("workspaceId", args.workspaceId)
        )
        .take(10),
      await ctx.db
        .query("channels")
        .withSearchIndex("searchName", (q) =>
          q.search("name", normalizedSearch).eq("workspaceId", args.workspaceId)
        )
        .take(10),
    ]);

    const members = allMembers.map(({ _id, name, image }) => ({
      id: _id,
      name,
      image,
      type: "members",
    }));

    const channels = allChannels.map(({ _id, name }) => ({
      id: _id,
      name,
      type: "channels",
    }));

    return {
      members,
      channels,
    };
  },
});
