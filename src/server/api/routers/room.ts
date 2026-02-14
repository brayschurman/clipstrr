import { z } from "zod";
import { nanoid } from "nanoid";
import { desc, eq, and, lt } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reactions, roomPosts, rooms } from "~/server/db/schema";
import { youtubeVideoSchema } from "~/lib/youtube";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        createdBy: z.string().min(1).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const roomId = nanoid(10);

      const [room] = await ctx.db
        .insert(rooms)
        .values({
          id: roomId,
          name: input.name,
          createdBy: input.createdBy,
        })
        .returning();

      return room;
    }),

  getRoom: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.query.rooms.findFirst({
        where: eq(rooms.id, input.roomId),
      });

      return room;
    }),

  getRoomPosts: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.query.roomPosts.findMany({
        where: input.cursor
          ? and(
            eq(roomPosts.roomId, input.roomId),
            lt(roomPosts.id, input.cursor),
          )
          : eq(roomPosts.roomId, input.roomId),
        limit: input.limit + 1,
        orderBy: [desc(roomPosts.createdAt)],
        with: {
          reactions: true,
        },
      });

      let nextCursor: number | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  createPost: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        youtubeUrl: youtubeVideoSchema,
        startTime: z.number().min(0),
        endTime: z.number().min(0).optional(),
        description: z.string().optional(),
        createdBy: z.string().min(1).max(50),
      }).transform(({ youtubeUrl, ...rest }) => ({
        ...rest,
        youtubeUrl: youtubeUrl.url,
        videoId: youtubeUrl.videoId,
      })),
    )
    .mutation(async ({ ctx, input }) => {
      const endTime = input.endTime ?? input.startTime;

      const [post] = await ctx.db
        .insert(roomPosts)
        .values({
          roomId: input.roomId,
          youtubeUrl: input.youtubeUrl,
          videoId: input.videoId,
          startTime: input.startTime,
          endTime,
          description: input.description,
          createdBy: input.createdBy,
        })
        .returning();

      return post;
    }),

  addReaction: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        emoji: z.string().min(1).max(10),
        createdBy: z.string().min(1).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if user already reacted with this emoji
      const existing = await ctx.db.query.reactions.findFirst({
        where: and(
          eq(reactions.postId, input.postId),
          eq(reactions.emoji, input.emoji),
          eq(reactions.createdBy, input.createdBy),
        ),
      });

      if (existing) {
        // if already exists, remove it (toggle behavior)
        await ctx.db
          .delete(reactions)
          .where(eq(reactions.id, existing.id));

        return { removed: true, reaction: existing };
      }

      // add new reaction
      const [reaction] = await ctx.db
        .insert(reactions)
        .values({
          postId: input.postId,
          emoji: input.emoji,
          createdBy: input.createdBy,
        })
        .returning();

      return { removed: false, reaction };
    }),

  removeReaction: publicProcedure
    .input(
      z.object({
        reactionId: z.number(),
        createdBy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // verify the reaction belongs to the user
      const reaction = await ctx.db.query.reactions.findFirst({
        where: eq(reactions.id, input.reactionId),
      });

      if (!reaction) {
        throw new Error("Reaction not found");
      }

      if (reaction.createdBy !== input.createdBy) {
        throw new Error("You can only remove your own reactions");
      }

      await ctx.db
        .delete(reactions)
        .where(eq(reactions.id, input.reactionId));

      return { success: true };
    }),
});
