import React from "react";

import type { GroupBuyItem } from "../../lib/groupBuys.data";

import { UserInfo } from "shared/ui/components/UserInfo";
import { ClockIcon, MessageTextIcon } from "shared/ui/icons";

import css from "./GroupBuyCard.module.scss";

interface Props {
   item: GroupBuyItem;
}

export const GroupBuyCard: React.FC<Props> = ({ item }) => {
   return (
      <article className={css.card}>
         <div className={css.card_header}>
            <div className={css.card_author}>
               <UserInfo
                  userName={item.userName}
                  userAvatar={item.userAvatar}
                  withName={true}
               />

               {/* <span className={css.card_user_name}>{item.userName}</span> */}

               <span className={css.card_divider} />

               <div className={css.card_tags}>
                  {item.providers.map((provider) => (
                     <span key={provider} className={css.card_tag}>
                        {provider}
                     </span>
                  ))}
               </div>
            </div>
         </div>

         <div className={css.card_content}>
            <div className={css.card_main}>
               <h3 className={css.card_title}>{item.title}</h3>

               <div className={css.card_description}>
                  <span className={css.card_description_mark} />

                  <p>{item.description}</p>
               </div>
            </div>

            <div className={css.card_info}>
               <div className={css.card_info_left}>
                  <span className={css.card_price}>${item.price}</span>

                  <span className={css.card_dot} />

                  <span className={css.card_persons}>
                     {item.persons} persons
                  </span>
               </div>

               <div className={css.card_info_right}>
                  <div className={css.card_meta}>
                     <ClockIcon />

                     <span>{item.publishedAt}</span>
                  </div>

                  <span className={css.card_dot} />

                  <div className={css.card_meta}>
                     <MessageTextIcon />

                     <span>{item.comments}</span>
                  </div>
               </div>
            </div>
         </div>
      </article>
   );
};