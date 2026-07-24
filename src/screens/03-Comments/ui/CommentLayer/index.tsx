"use client";

import React from "react";

import clsx from "clsx";
import type { CommentLayerType } from "screens/03-Comments/lib/comments.type";

import { useTranslation } from "shared/lib/i18n";
import { formatRelativeDate } from "shared/lib/i18n/formatters";
import Image from "shared/ui/base/Image";
import { UserInfo } from "shared/ui/components/UserInfo";
import { ReplyIcon, ShareIcon, StarIcon } from "shared/ui/icons";

import css from "./CommentLayer.module.scss";

interface Prop {
   className?: string;
   data: CommentLayerType;
}

type VoteType = "like" | "dislike" | null;

type CommentTone = "orange" | "blue" | "white";

const COMMENT_TONES: CommentTone[] = ["orange", "blue", "white"];

const getCommentTone = (id: string | number): CommentTone => {
   const value = String(id);

   const hash = Array.from(value).reduce((result, character) => {
      return result + character.charCodeAt(0);
   }, 0);

   return COMMENT_TONES[hash % COMMENT_TONES.length];
};

export const CommentLayer: React.FC<Prop> = ({ className, data }) => {
   const { locale, t } = useTranslation();

   const translation = t.groupBuys.items[data.translationKey];

   const [vote, setVote] = React.useState<VoteType>(null);
   const [isFavorite, setIsFavorite] = React.useState(false);

   const tone = getCommentTone(data.id);

   const likes = data.reactions.likes + (vote === "like" ? 1 : 0);

   const dislikes = data.reactions.dislikes + (vote === "dislike" ? 1 : 0);

   const favorites = data.reactions.favorites + (isFavorite ? 1 : 0);

   const handleLike = () => {
      setVote((currentVote) => (currentVote === "like" ? null : "like"));
   };

   const handleDislike = () => {
      setVote((currentVote) => (currentVote === "dislike" ? null : "dislike"));
   };

   const handleFavorite = () => {
      setIsFavorite((currentValue) => !currentValue);
   };

   return (
      <article className={clsx(css.comment_layer, css[`comment_layer_${tone}`], className)}>
         <div className={css.comment_layer_header}>
            <UserInfo userName={data.userName} userAvatar={data.userAvatar} withName />

            <span className={css.comment_layer_dot} />

            <time className={css.comment_layer_date} dateTime={data.publishedAt}>
               {formatRelativeDate(data.publishedAt, locale)}
            </time>
         </div>

         <p className={css.comment_layer_text}>{translation.review}</p>

         <div className={css.comment_layer_actions}>
            <button
               type="button"
               className={clsx(
                  css.comment_layer_action,
                  css.comment_layer_reaction,
                  vote === "like" && css.is_active
               )}
               aria-label={t.groupBuys.actions.like}
               aria-pressed={vote === "like"}
               onClick={handleLike}
            >
               <Image.Default
                  className={css.comment_layer_reaction_icon}
                  src={vote === "like" ? "/icons/like-fill.svg" : "/icons/like.svg"}
                  alt=""
                  aria-hidden="true"
               />

               <span>{likes}</span>
            </button>

            <button
               type="button"
               className={clsx(
                  css.comment_layer_action,
                  css.comment_layer_reaction,
                  vote === "dislike" && css.is_active
               )}
               aria-label={t.groupBuys.actions.dislike}
               aria-pressed={vote === "dislike"}
               onClick={handleDislike}
            >
               <Image.Default
                  className={css.comment_layer_reaction_icon}
                  src={vote === "dislike" ? "/icons/dislike-fill.svg" : "/icons/dislike.svg"}
                  alt=""
                  aria-hidden="true"
               />

               <span>{dislikes}</span>
            </button>

            <button
               type="button"
               className={clsx(
                  css.comment_layer_action,
                  css.comment_layer_reaction,
                  css.comment_layer_favorite,
                  isFavorite && css.is_active
               )}
               aria-label={t.groupBuys.actions.favorite}
               aria-pressed={isFavorite}
               onClick={handleFavorite}
            >
               <StarIcon className={css.comment_layer_reaction_icon} />

               <span>{favorites}</span>
            </button>

            <button
               type="button"
               className={clsx(css.comment_layer_action, css.comment_layer_simple_action)}
            >
               <ReplyIcon />

               <span>{t.groupBuys.reply}</span>
            </button>

            <button
               type="button"
               className={clsx(
                  css.comment_layer_action,
                  css.comment_layer_simple_action,
                  css.comment_layer_share
               )}
               aria-label={t.groupBuys.actions.share}
            >
               <ShareIcon />
            </button>
         </div>
      </article>
   );
};
