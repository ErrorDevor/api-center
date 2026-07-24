export type CommentTranslationKey = "yunwu";

export type CommentReactionType = {
   likes: number;
   dislikes: number;
   favorites: number;
};

export type CommentLayerType = {
   id: string;
   userName: string;
   userAvatar?: string;
   publishedAt: string;
   translationKey: CommentTranslationKey;
   reactions: CommentReactionType;
   replies?: CommentLayerType[];
};

export type CommentDataType = {
   translationKey: CommentTranslationKey;
   price: number;
   persons: number;
   publishedAt: string;
   comments: number;
   providerDetails: CommentProviderDetails;
   reviews: CommentLayerType[];
};

export type CommentType = {
   id: string;
   userName: string;
   userAvatar: string;
   providers: string[];
   commentsData: CommentDataType;
};

export type CommentProviderAge = {
   years: number;
   months: number;
};

export type CommentProviderModel = {
   id: string;
   name: string;
   icon: string;
   inputPrice: number;
   outputPrice: number;
};

export type CommentProviderDetails = {
   url: string;
   age: CommentProviderAge;
   paymentMethods: string[];
   rating: number;
   positiveReviews: number;
   negativeReviews: number;
   models: CommentProviderModel[];
};
