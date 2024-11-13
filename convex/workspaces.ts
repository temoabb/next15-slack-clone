import { query } from "./_generated/server";

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    // Return all possible workspaces:
    return await ctx.db.query("workspaces").collect();
  },
});
