export type CreatePostType = "model" | "discussion";

export interface CreatePostBaseData {
   title: string;
   description: string;
   tags: string[];
}

export interface CreateDiscussionPostData extends CreatePostBaseData {
   type: "discussion";
}

export interface CreateModelPostData extends CreatePostBaseData {
   type: "model";
   modelId: string;
   price: string;
   personsCount: string;
}

export type CreatePostData = CreateDiscussionPostData | CreateModelPostData;

export interface ModelOption {
   id: string;
   name: string;
}
