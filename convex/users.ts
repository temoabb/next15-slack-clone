import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    // When you use a 'db' method and you 'get' something you do not need to specify a collection which you are trying to get.
    // It has an unique id for 'users':

    return await ctx.db.get(userId);
  },
});
