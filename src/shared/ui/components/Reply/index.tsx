"use client";

import React from "react";

import clsx from "clsx";

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
   placeholder = "Опубликовать ответ",
   buttonText = "Ответить",
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
      const isSubmitShortcut =
         event.key === "Enter" && (event.ctrlKey || event.metaKey);

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
                  aria-label="Добавить изображение"
                  disabled={disabled}
                  className={css.reply_action}
                  onClick={onImageClick}
               >
                  <ImageIcon />
               </button>

               <button
                  type="button"
                  aria-label="Добавить эмодзи"
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

const ImageIcon: React.FC = () => {
   return (
      <svg
         viewBox="0 0 18 18"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true"
      >
         <rect
            x="1.5"
            y="1.5"
            width="15"
            height="15"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.5"
         />

         <circle
            cx="11.75"
            cy="5.25"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
         />

         <path
            d="M2.5 12.5L6.25 8.75C6.65 8.35 7.3 8.35 7.7 8.75L9.5 10.55L10.7 9.35C11.1 8.95 11.75 8.95 12.15 9.35L15.5 12.7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};

const EmojiIcon: React.FC = () => {
   return (
      <svg
         viewBox="0 0 18 18"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true"
      >
         <circle
            cx="9"
            cy="9"
            r="7.5"
            stroke="currentColor"
            strokeWidth="1.5"
         />

         <circle cx="6.5" cy="7" r="0.75" fill="currentColor" />
         <circle cx="11.5" cy="7" r="0.75" fill="currentColor" />

         <path
            d="M6.5 11.25C7.1 11.95 7.95 12.3 9 12.3C10.05 12.3 10.9 11.95 11.5 11.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
         />
      </svg>
   );
};