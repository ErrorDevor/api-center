import React from "react";

import type { TopicItem } from "../../lib/types";

import { useTranslation } from "shared/lib/i18n";
import { formatRelativeDate } from "shared/lib/i18n/formatters";
import { UserInfo } from "shared/ui/components/UserInfo";
import { ClockIcon, MessageTextIcon } from "shared/ui/icons";
import css from "./TopicCard.module.scss";

interface Prop {
   data: TopicItem;
   onClick?: (id: number) => void;
}

export const TopicCard: React.FC<Prop> = ({ data, onClick }) => {
   const { locale } = useTranslation();

   const handleClick = () => {
      onClick?.(data.id);
   };

   return (
      <article className={css.topic_card} onClick={handleClick}>
         <div className={css.topic_card_header}>
            {data.userAvatar ? (
               <UserInfo userName={data.userName} userAvatar={data.userAvatar} withName />
            ) : (
               <span className={css.topic_card_user_name}>{data.userName}</span>
            )}
         </div>

         <div className={css.topic_card_content}>
            <h3 className={css.topic_card_title}>{data.title}</h3>

            <div className={css.topic_card_quote}>
               <span className={css.topic_card_quote_line} />

               <p className={css.topic_card_quote_text}>{data.description}</p>
            </div>
         </div>

         <div className={css.topic_card_info}>
            <span className={css.topic_card_divider} />

            <div className={css.topic_card_meta}>
               <div className={css.topic_card_meta_item}>
                  <ClockIcon />

                  <time dateTime={data.publishedAt}>
                     {formatRelativeDate(data.publishedAt, locale)}
                  </time>
               </div>

               <span className={css.topic_card_meta_dot} />

               <div className={css.topic_card_meta_item}>
                  <MessageTextIcon />

                  <span>{data.commentsCount}</span>
               </div>
            </div>
         </div>
      </article>
   );
};
