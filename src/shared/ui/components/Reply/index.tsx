"use client";

import React from "react";

import clsx from "clsx";

import { EmojiIcon } from "shared/ui/icons/Emoji.icon";
import { ImageIcon } from "shared/ui/icons/Image.icon";

import css from "./Reply.module.scss";

interface Prop {
   className?: string;
   placeholder?: string;
   buttonText?: string;
   disabled?: boolean;
   onSubmit?: (value: string) => void;
   onImageClick?: () => void;
   onEmojiClick?: () => void;
}

export const Reply: React.FC<Prop> = ({
   className,
   placeholder = "Post your reply",
   buttonText = "Reply",
   disabled = false,
   onSubmit,
   onImageClick,
   onEmojiClick,
}) => {
   const [value, setValue] = React.useState("");

   const textareaRef = React.useRef<HTMLTextAreaElement>(null);

   const normalizedValue = value.trim();
   const isSubmitDisabled = disabled || !normalizedValue;

   const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
   };

   const handleSubmit = () => {
      if (isSubmitDisabled) {
         return;
      }

      onSubmit?.(normalizedValue);
      setValue("");

      textareaRef.current?.focus();
   };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isSubmitShortcut = event.key === "Enter" && (event.ctrlKey || event.metaKey);

      if (!isSubmitShortcut) {
         return;
      }

      event.preventDefault();
      handleSubmit();
   };

   return (
      <div className={clsx(css.reply, className)}>
         <div className={css.reply_content}>
            <textarea
               ref={textareaRef}
               rows={1}
               value={value}
               placeholder={placeholder}
               disabled={disabled}
               className={css.reply_input}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
            />

            <div className={css.reply_actions}>
               <button
                  type="button"
                  aria-label="add image"
                  disabled={disabled}
                  className={css.reply_action}
                  onClick={onImageClick}
               >
                  <ImageIcon />
               </button>

               <button
                  type="button"
                  aria-label="add emoji"
                  disabled={disabled}
                  className={css.reply_action}
                  onClick={onEmojiClick}
               >
                  <EmojiIcon />
               </button>
            </div>
         </div>

         <button
            type="button"
            disabled={isSubmitDisabled}
            className={css.reply_submit}
            onClick={handleSubmit}
         >
            <span className={css.reply_submit_blur_left} />
            <span className={css.reply_submit_blur_right} />

            <span className={css.reply_submit_text}>{buttonText}</span>
         </button>
      </div>
   );
};