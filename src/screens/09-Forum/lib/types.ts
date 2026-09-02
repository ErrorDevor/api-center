export interface ForumAuthorData {
   id: string;
   name: string;
   avatar?: string;
   avatarVariant?: "blue" | "purple";
}

export interface ForumCommentData {
   id: string;
   author: ForumAuthorData;
   createdAt: string;
   text: string;
   likes: number;
   dislikes: number;
   rating: number;
   repliesLabel?: string;
   isNested?: boolean;
   children?: ForumCommentData[];
}

export interface ForumTopicData {
   id: string;
   author: ForumAuthorData;
   providers: string[];
   title: string;
   quote: string;
}

export interface CommentLayerType {
   id: string | number;
   userName: string;
   userAvatar?: string;
   publishedAt: string;
   content: string;
   reactions: {
      likes: number;
      dislikes: number;
   };
   userVote?: "like" | "dislike" | "";
   replyCount?: number;
   replies?: CommentLayerType[];
}