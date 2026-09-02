import React from "react";

import type { CommentLayerType } from "../../lib/types";
import { useTranslation } from "shared/lib/i18n";
import { CommentLayer } from "shared/ui/components/CommentLayer";
import type { CommentLayerActions } from "shared/ui/components/CommentLayer";

import css from "./ForumComments.module.scss";

interface Prop {
   comments: CommentLayerType[];
   actions?: CommentLayerActions;
   isLoading?: boolean;
   error?: boolean;
}

export const ForumComments: React.FC<Prop> = ({ comments, actions, isLoading, error }) => {
   const { t } = useTranslation();

   return (
      <div className={css.forum_comments}>
         <h3 className={css.forum_comments_title}>{t.common.participants}</h3>

         <div className={css.forum_comments_list}>
            {error && <p className={css.forum_comments_message}>{t.groupBuys.loadError}</p>}

            {!isLoading && !error && comments.length === 0 && (
               <p className={css.forum_comments_message}>{t.groupBuys.noReviewsYet}</p>
            )}

            {comments.map((comment, index) => (
               <React.Fragment key={comment.id}>
                  {index > 0 && <span className={css.forum_comments_separator} />}

                  <CommentLayer data={comment} withBackground={false} actions={actions} />
               </React.Fragment>
            ))}
         </div>
      </div>
   );
};
