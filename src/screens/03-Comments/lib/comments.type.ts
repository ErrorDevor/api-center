export type CommentTranslationKey = "yunwu";

export type CommentLayerTone = "orange" | "blue" | "white";

export type CommentReactionType = {
   likes: number;
   dislikes: number;
   favorites: number;
};

export type CommentLayerType = {
   id: string;
   userName: string;
   userAvatar: string;
   publishedAt: string;
   translationKey: CommentTranslationKey;
   reactions: CommentReactionType;
   tone: CommentLayerTone;
};

export type CommentDataType = {
   translationKey: CommentTranslationKey;
   price: number;
   persons: number;
   publishedAt: string;
   comments: number;
   reviews: CommentLayerType[];
};

export type CommentType = {
   id: string;
   userName: string;
   userAvatar: string;
   providers: string[];
   commentsData: CommentDataType;
};
