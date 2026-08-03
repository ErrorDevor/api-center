import type { CreatePostType, ModelOption } from "./createPost.types";

export interface CreatePostTypeOption {
   id: CreatePostType;
   translationKey: CreatePostType;
}

export const createPostTypeOptions: CreatePostTypeOption[] = [
   {
      id: "discussion",
      translationKey: "discussion",
   },
   {
      id: "model",
      translationKey: "model",
   },
];

export const createPostModelOptions: ModelOption[] = [
   {
      id: "gpt-5-6",
      name: "GPT-5.6",
   },
   {
      id: "gpt-4o",
      name: "GPT-4o",
   },
   {
      id: "o3",
      name: "o3",
   },
];
