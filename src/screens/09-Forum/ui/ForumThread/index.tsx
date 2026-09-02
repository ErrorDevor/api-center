import React from "react";

import type { CommentLayerType } from "../../lib/types";

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

         <Reply placeholder={replyPlaceholder} buttonText={replyButtonText} />

         <ForumComments comments={comments} />
      </div>
   );
};
