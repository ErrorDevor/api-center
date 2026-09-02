import React from "react";

import type { CommentLayerType } from "../../lib/types";
import { useTranslation } from "shared/lib/i18n";
import { CommentLayer } from "shared/ui/components/CommentLayer";

import css from "./ForumComments.module.scss";

interface Prop {
   comments: CommentLayerType[];
}

export const ForumComments: React.FC<Prop> = ({ comments }) => {
    const { t } = useTranslation();
   return (
      <div className={css.forum_comments}>
         <h3 className={css.forum_comments_title}>{t.common.participants}</h3>

         <div className={css.forum_comments_list}>
            {comments.map((comment, index) => (
               <React.Fragment key={comment.id}>
                  {index > 0 && <span className={css.forum_comments_separator} />}

                  <CommentLayer data={comment} withBackground={false} />
               </React.Fragment>
            ))}
         </div>
      </div>
   );
};
