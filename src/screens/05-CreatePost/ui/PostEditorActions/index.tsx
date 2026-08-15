"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { EmojiIcon } from "shared/ui/icons/Emoji.icon";
import { ImageIcon } from "shared/ui/icons/Image.icon";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./PostEditorActions.module.scss";

interface Props {
   submitDisabled?: boolean;
   onImageChange?: (file: File) => void;
   onEmojiClick?: () => void;
   onTagsClick?: () => void;
}

export const PostEditorActions: React.FC<Props> = ({
   submitDisabled = false,
   onImageChange,
   onEmojiClick,
   onTagsClick,
}) => {
   const { t } = useTranslation();

   const imageInputRef = React.useRef<HTMLInputElement>(null);

   const handleImageButtonClick = () => {
      imageInputRef.current?.click();
   };

   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
         return;
      }

      onImageChange?.(file);

      event.target.value = "";
   };

   return (
      <div className={css.post_editor_actions}>
         <div className={css.post_editor_actions_left}>
            <input
               ref={imageInputRef}
               type="file"
               accept="image/*"
               hidden
               onChange={handleImageChange}
            />

            <button
               type="button"
               aria-label={t.createPost.actions.addImage}
               className={css.post_editor_actions_icon}
               onClick={handleImageButtonClick}
            >
               <ImageIcon />
            </button>

            <button
               type="button"
               aria-label={t.createPost.actions.addEmoji}
               className={css.post_editor_actions_icon}
               onClick={onEmojiClick}
            >
               <EmojiIcon />
            </button>

            <span className={css.post_editor_actions_divider} aria-hidden="true" />

            <button type="button" className={css.post_editor_actions_tags} onClick={onTagsClick}>
               # {t.createPost.actions.addTags}
            </button>
         </div>

         <Button
            type="submit"
            disabled={submitDisabled}
            className={css.post_editor_actions_publish}
            variant="black"
         >
            {t.createPost.actions.publish}
         </Button>
      </div>
   );
};
