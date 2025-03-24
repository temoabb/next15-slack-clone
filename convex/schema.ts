import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

const schema = defineSchema({
  ...authTables,

  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),

  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
    name: v.string(),
    image: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"])
    .searchIndex("searchName", {
      searchField: "name",
      filterFields: ["workspaceId"],
    }),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspaceId"])
    .searchIndex("searchName", {
      searchField: "name",
      filterFields: ["workspaceId"],
    }),

  // 1:1 conversations, direct messages
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"), // It does not matter which one is the first and which one is the second
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),

    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),

    originInfo: v.optional(
      v.object({
        messageId: v.id("messages"),

        authorMemberId: v.id("members"),
        authorName: v.string(),
        authorImage: v.optional(v.string()),

        messageBody: v.optional(v.string()),
        messageImage: v.optional(v.id("_storage")),

        originId: v.union(v.id("channels"), v.id("conversations")),
        originTitle: v.union(v.literal("channels"), v.literal("conversations")),

        _creationTime: v.number(),
        updatedAt: v.optional(v.number()),
      })
    ),

    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])

    // If a message at any point has a 'parentMessageId', most definitely that's a message, that should ONLY be laoded as a REPLY to a certain message.
    .index("by_parent_message_id", ["parentMessageId"])

    // To load threads in channels and in one-on-one conversations
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(), // Value of the emoji
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
});

export default schema;
