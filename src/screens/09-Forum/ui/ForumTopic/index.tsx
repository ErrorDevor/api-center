import React from "react";

import { UserInfo } from "shared/ui/components/UserInfo";

import css from "./ForumTopic.module.scss";

interface Prop {
   userName: string;
   userAvatar?: string;
   providers: string[];
   title: string;
   description: string;
}

export const ForumTopic: React.FC<Prop> = ({
   userName,
   userAvatar,
   providers,
   title,
   description,
}) => {
   return (
      <div className={css.forum_topic}>
         <div className={css.forum_topic_header}>
            <div className={css.forum_topic_user}>
               {userAvatar ? (
                  <UserInfo userName={userName} userAvatar={userAvatar} withName />
               ) : (
                  <span className={css.forum_topic_user_name}>{userName}</span>
               )}

               <span className={css.forum_topic_separator} />

               <div className={css.forum_topic_tags}>
                  {providers.map((provider) => (
                     <span className={css.forum_topic_tag} key={provider}>
                        {provider}
                     </span>
                  ))}
               </div>
            </div>
         </div>

         <div className={css.forum_topic_body}>
            <h2 className={css.forum_topic_title}>{title}</h2>

            <div className={css.forum_topic_quote}>
               <span className={css.forum_topic_quote_line} />

               <p className={css.forum_topic_quote_text}>{description}</p>
            </div>
         </div>
      </div>
   );
};
