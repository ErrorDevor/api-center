"use client";

import React from "react";

import clsx from "clsx";
import type { CommentType } from "screens/03-Comments/lib/comments.type";

import { useTranslation } from "shared/lib/i18n";
import { formatComments, formatPersons, formatRelativeDate } from "shared/lib/i18n/formatters";
import { UserInfo } from "shared/ui/components/UserInfo";
import { ClockIcon, MessageTextIcon } from "shared/ui/icons";

import { CommentLayer } from "../CommentLayer";

import css from "./CommentCard.module.scss";

interface Prop {
   className?: string;
   data: CommentType;
}

export const CommentCard: React.FC<Prop> = ({ className, data }) => {
   const { locale, t } = useTranslation();

   const { commentsData } = data;
   const translation = t.groupBuys.items[commentsData.translationKey];

   return (
      <div className={clsx(css.comment_card, className)}>
         <div className={css.comment_card_header}>
            <div className={css.comment_card_author}>
               <UserInfo userName={data.userName} userAvatar={data.userAvatar} withName />

               <span className={css.comment_card_divider} />

               <div className={css.comment_card_tags}>
                  {data.providers.map((provider) => (
                     <span key={provider} className={css.comment_card_tag}>
                        {provider}
                     </span>
                  ))}
               </div>
            </div>
         </div>

         <div className={css.comment_card_content}>
            <div className={css.comment_card_main}>
               <h3 className={css.comment_card_title}>{translation.title}</h3>

               <div className={css.comment_card_description}>
                  <span className={css.comment_card_description_mark} />

                  <p>{translation.description}</p>
               </div>
            </div>

            <div className={css.comment_card_bottom}>
               <div className={css.comment_card_bottom_left}>
                  <span className={css.card_price}>${commentsData.price}</span>

                  <span className={css.card_dot} />

                  <span className={css.card_persons}>
                     {formatPersons(commentsData.persons, locale)}
                  </span>
               </div>

               <div className={css.comment_card_bottom_right}>
                  <div className={css.card_meta}>
                     <ClockIcon />

                     <span>{formatRelativeDate(commentsData.publishedAt, locale)}</span>
                  </div>

                  <span className={css.card_dot} />

                  <div className={css.card_meta}>
                     <MessageTextIcon />

                     <span>{formatComments(commentsData.comments, locale)}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className={css.comment_card_comments}>
            <h6>{t.common.participants}</h6>

            <div className={css.comment_card_list}>
               {commentsData.reviews.map((item) => (
                  <CommentLayer key={item.id} data={item} />
               ))}
            </div>
         </div>
      </div>
   );
};
