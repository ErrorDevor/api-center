"use client";

import React from "react";

import clsx from "clsx";
import type { CommentType } from "screens/03-Reviews/lib/comments.type";

import { useTranslation } from "shared/lib/i18n";
import { UserInfo } from "shared/ui/components/UserInfo";

import { CommentCardOptions } from "../CommentCardOptions";

import css from "./CommentCard.module.scss";

interface Prop {
   className?: string;
   data: CommentType;
}

export const CommentCard: React.FC<Prop> = ({ className, data }) => {
   const { t } = useTranslation();

   const { commentsData } = data;
   const translation = t.groupBuys.items[commentsData.translationKey];

   return (
      <div className={clsx(css.comment_card, className)}>
         <div className={css.comment_card_header}>
            <div className={css.comment_card_author}>
               <UserInfo userName={data.userName} userAvatar={data.userAvatar} withName />

               {/* <span className={css.comment_card_divider} /> */}

               {/* <div className={css.comment_card_tags}>
                  {data.providers.map((provider) => (
                     <span key={provider} className={css.comment_card_tag}>
                        {provider}
                     </span>
                  ))}
               </div> */}
            </div>
         </div>

         <div className={css.comment_card_content}>
            <div className={css.comment_card_main}>
               <h3 className={css.comment_card_title}>{translation.title}</h3>

               <div className={css.comment_card_description}>
                  <span className={css.comment_card_description_mark} />

                  <p>{translation.description}</p>
               </div>

               <CommentCardOptions data={commentsData.providerDetails} />
            </div>
         </div>
      </div>
   );
};
