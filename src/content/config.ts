import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      date: z.string(),
      excerpt: z.string().optional(),
      image: z.string().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional()
    })
  }),
  events: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      date: z.string(),
      endDate: z.string().optional(),
      venue: z.string().optional(),
      location: z.string().optional(),
      rsvpUrl: z.string().optional(),
      excerpt: z.string().optional()
    })
  }),
  programs: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      intro: z.string().optional(),
      pillars: z.array(z.string()).optional()
    })
  }),
  resources: defineCollection({
    type: "content",
    schema: z.object({
      type: z.enum(["guide", "report", "tool"]),
      title: z.string(),
      file: z.string().optional(),
      url: z.string().optional(),
      topics: z.array(z.string()).optional()
    })
  }),
  stories: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      sector: z.string().optional(),
      county: z.string().optional(),
      outcomes: z.array(z.string()).optional()
    })
  }),
  partners: defineCollection({
    type: "content",
    schema: z.object({
      orgName: z.string(),
      url: z.string().optional(),
      sector: z.string(),
      county: z.string()
    })
  }),
  projects: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(["current", "completed"]),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      location: z.string().optional(),
      image: z.string().optional(),
      partners: z.array(z.string()).optional(),
      impact: z.array(z.string()).optional()
    })
  })
};
