import React from "react";

import type { CommentLayerType } from "../../lib/types";

import type { CommentLayerActions } from "shared/ui/components/CommentLayer";
import { Reply } from "shared/ui/components/Reply";

import { ForumComments } from "../ForumComments";
import { ForumTopic } from "../ForumTopic";

import css from "./ForumThread.module.scss";

interface Prop {
   comments: CommentLayerType[];
   userName: string;
   userAvatar?: string;
   providers: string[];
   title: string;
   description: string;
   replyPlaceholder: string;
   replyButtonText: string;
   actions?: CommentLayerActions;
   isLoading?: boolean;
   error?: boolean;
   isPosting?: boolean;
   onCreatePost?: (content: string) => void;
}

export const ForumThread: React.FC<Prop> = ({
   comments,
   userName,
   userAvatar,
   providers,
   title,
   description,
   replyPlaceholder,
   replyButtonText,
   actions,
   isLoading,
   error,
   isPosting,
   onCreatePost,
}) => {
   return (
      <div className={css.forum_thread}>
         <ForumTopic
            userName={userName}
            userAvatar={userAvatar}
            providers={providers}
            title={title}
            description={description}
         />

         <Reply
            placeholder={replyPlaceholder}
            buttonText={replyButtonText}
            disabled={isPosting}
            onSubmit={onCreatePost}
         />

         <ForumComments
            comments={comments}
            actions={actions}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
};
