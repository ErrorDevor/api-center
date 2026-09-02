"use client";

import React from "react";

import clsx from "clsx";
import type { CommentLayerType } from "screens/03-Reviews/lib/comments.type";

import { useTranslation } from "shared/lib/i18n";
import { formatRelativeDate } from "shared/lib/i18n/formatters";
import Image from "shared/ui/base/Image";
import { Reply } from "shared/ui/components/Reply";
import { UserInfo } from "shared/ui/components/UserInfo";
import { ReplyIcon, ShareIcon } from "shared/ui/icons";

import css from "./CommentLayer.module.scss";

// Optional real backend wiring — the Reviews screen passes this so
// like/dislike/reply actually round-trip through COMMENTS_API_GUIDE.md.
// When omitted (04-Buys' still-mock "participants" list), the actions just
// render as static counts instead of pretending to be interactive.
export interface CommentLayerActions {
   isAuthenticated: boolean;
   onRequireAuth: () => void;
   onVote: (commentId: string | number, voteType: "like" | "dislike" | "none") => Promise<void>;
   onLoadReplies: (commentId: string | number) => Promise<CommentLayerType[]>;
   onReply: (commentId: string | number, content: string) => Promise<boolean>;
}

interface Prop {
   className?: string;
   data: CommentLayerType;
   withBackground?: boolean;
   actions?: CommentLayerActions;
}

interface CommentItemProp {
   data: CommentLayerType;
   isReply?: boolean;
   actions?: CommentLayerActions;
   replyCount?: number;
   areRepliesExpanded?: boolean;
   isLoadingReplies?: boolean;
   onToggleReplies?: () => void;
   onReplyPosted?: () => void;
}

type CommentTone = "orange" | "blue" | "white";

const COMMENT_TONES: CommentTone[] = ["orange", "blue", "white"];

const getCommentTone = (id: string | number): CommentTone => {
   const value = String(id);

   const hash = Array.from(value).reduce((result, character) => {
      return result + character.charCodeAt(0);
   }, 0);

   return COMMENT_TONES[hash % COMMENT_TONES.length];
};

const CommentItem: React.FC<CommentItemProp> = ({
   data,
   isReply = false,
   actions,
   replyCount = 0,
   areRepliesExpanded = false,
   isLoadingReplies = false,
   onToggleReplies,
   onReplyPosted,
}) => {
   const { locale, t } = useTranslation();

   const [likeCount, setLikeCount] = React.useState(data.reactions.likes);
   const [dislikeCount, setDislikeCount] = React.useState(data.reactions.dislikes);
   const [userVote, setUserVote] = React.useState<"like" | "dislike" | "">(data.userVote ?? "");
   const [isVoting, setIsVoting] = React.useState(false);

   const [isComposingReply, setIsComposingReply] = React.useState(false);
   const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

   const handleVote = async (voteType: "like" | "dislike") => {
      if (!actions || isVoting) {
         return;
      }

      if (!actions.isAuthenticated) {
         actions.onRequireAuth();
         return;
      }

      const nextVote = userVote === voteType ? "none" : voteType;
      const previous = { likeCount, dislikeCount, userVote };

      // Optimistic update — rolled back below if the request fails.
      setUserVote(nextVote === "none" ? "" : nextVote);
      setLikeCount(
         (count) => count + (nextVote === "like" ? 1 : 0) - (userVote === "like" ? 1 : 0)
      );
      setDislikeCount(
         (count) => count + (nextVote === "dislike" ? 1 : 0) - (userVote === "dislike" ? 1 : 0)
      );

      setIsVoting(true);

      try {
         await actions.onVote(data.id, nextVote);
      } catch {
         setLikeCount(previous.likeCount);
         setDislikeCount(previous.dislikeCount);
         setUserVote(previous.userVote);
      } finally {
         setIsVoting(false);
      }
   };

   const handleToggleReplyCompose = () => {
      if (!actions) {
         return;
      }

      if (!actions.isAuthenticated) {
         actions.onRequireAuth();
         return;
      }

      setIsComposingReply((current) => !current);
   };

   const handleSubmitReply = async (content: string) => {
      if (!actions) {
         return;
      }

      setIsSubmittingReply(true);

      try {
         const ok = await actions.onReply(data.id, content);

         if (ok) {
            setIsComposingReply(false);
            onReplyPosted?.();
         }
      } finally {
         setIsSubmittingReply(false);
      }
   };

   return (
      <div className={css.comment_layer_item}>
         <div className={css.comment_layer_header}>
            {data.userAvatar ? (
               <UserInfo userName={data.userName} userAvatar={data.userAvatar} withName />
            ) : (
               <span className={css.comment_layer_user_name}>{data.userName}</span>
            )}

            <span className={css.comment_layer_dot} />

            <time className={css.comment_layer_date} dateTime={data.publishedAt}>
               {formatRelativeDate(data.publishedAt, locale)}
            </time>
         </div>

         <div className={css.comment_layer_body}>
            <p className={css.comment_layer_text}>{data.content}</p>

            <div className={css.comment_layer_actions}>
               <button
                  type="button"
                  className={clsx(
                     css.comment_layer_action,
                     css.comment_layer_reaction,
                     userVote === "like" && css.is_active
                  )}
                  aria-label={t.groupBuys.actions.like}
                  aria-pressed={userVote === "like"}
                  disabled={!actions || isVoting}
                  onClick={() => handleVote("like")}
               >
                  <ReactionIcon variant="like" active={userVote === "like"} />

                  <span>{likeCount}</span>
               </button>

               <button
                  type="button"
                  className={clsx(
                     css.comment_layer_action,
                     css.comment_layer_reaction,
                     userVote === "dislike" && css.is_active
                  )}
                  aria-label={t.groupBuys.actions.dislike}
                  aria-pressed={userVote === "dislike"}
                  disabled={!actions || isVoting}
                  onClick={() => handleVote("dislike")}
               >
                  <ReactionIcon variant="dislike" active={userVote === "dislike"} />

                  <span>{dislikeCount}</span>
               </button>

               {!isReply && (
                  <button
                     type="button"
                     className={clsx(css.comment_layer_action, css.comment_layer_simple_action)}
                     onClick={handleToggleReplyCompose}
                  >
                     <ReplyIcon />

                     <span>{t.groupBuys.reply}</span>
                  </button>
               )}

               {!isReply && replyCount > 0 && (
                  <button
                     type="button"
                     className={clsx(css.comment_layer_action, css.comment_layer_simple_action)}
                     disabled={isLoadingReplies}
                     onClick={onToggleReplies}
                  >
                     <span>
                        {areRepliesExpanded
                           ? t.groupBuys.hideReplies
                           : t.groupBuys.viewReplies.replace("{count}", String(replyCount))}
                     </span>
                  </button>
               )}

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

            {!isReply && isComposingReply && (
               <Reply
                  className={css.comment_layer_reply_form}
                  placeholder={t.common.replyPlaceholder}
                  buttonText={t.common.buttonText}
                  disabled={isSubmittingReply}
                  onSubmit={handleSubmitReply}
               />
            )}
         </div>
      </div>
   );
};

interface ReactionIconProp {
   variant: "like" | "dislike";
   active: boolean;
}

const ReactionIcon: React.FC<ReactionIconProp> = ({ variant, active }) => (
   <Image.Default
      className={css.comment_layer_reaction_icon}
      src={active ? `/icons/${variant}-fill.svg` : `/icons/${variant}.svg`}
      alt=""
      aria-hidden="true"
   />
);

export const CommentLayer: React.FC<Prop> = ({
   className,
   data,
   withBackground = true,
   actions,
}) => {
   const tone = withBackground ? getCommentTone(data.id) : undefined;
   const replyCount = data.replyCount ?? data.replies?.length ?? 0;

   const [replies, setReplies] = React.useState<CommentLayerType[] | null>(data.replies ?? null);
   const [areRepliesExpanded, setAreRepliesExpanded] = React.useState(
      Boolean(data.replies?.length)
   );
   const [isLoadingReplies, setIsLoadingReplies] = React.useState(false);

   const loadReplies = async () => {
      if (!actions) {
         return;
      }

      setIsLoadingReplies(true);

      try {
         const loaded = await actions.onLoadReplies(data.id);

         setReplies(loaded);
      } finally {
         setIsLoadingReplies(false);
      }
   };

   const handleToggleReplies = async () => {
      if (areRepliesExpanded) {
         setAreRepliesExpanded(false);
         return;
      }

      if (replies === null && actions) {
         await loadReplies();
      }

      setAreRepliesExpanded(true);
   };

   const handleReplyPosted = async () => {
      await loadReplies();
      setAreRepliesExpanded(true);
   };

   const hasReplies = replyCount > 0;

   return (
      <article
         className={clsx(
            css.comment_layer,
            css[`comment_layer_${tone}`],
            hasReplies && css.has_replies,
            className,
            withBackground && css.comment_layer_background
         )}
      >
         <CommentItem
            data={data}
            actions={actions}
            replyCount={replyCount}
            areRepliesExpanded={areRepliesExpanded}
            isLoadingReplies={isLoadingReplies}
            onToggleReplies={handleToggleReplies}
            onReplyPosted={handleReplyPosted}
         />

         {areRepliesExpanded && replies && replies.length > 0 && (
            <div className={css.comment_layer_replies}>
               {replies.map((reply) => (
                  <CommentItem key={reply.id} data={reply} isReply actions={actions} />
               ))}
            </div>
         )}
      </article>
   );
};
