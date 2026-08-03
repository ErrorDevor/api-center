"use client";

import React from "react";

import { createPostTypeOptions } from "../../lib/createPost.data";
import type { CreatePostType } from "../../lib/createPost.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { useClickOutside } from "shared/utils/hooks/useClickOutside";

import css from "./PostTypeDropdown.module.scss";

interface Props {
   className?: string;
   value: CreatePostType;
   onChange: (value: CreatePostType) => void;
}

export const PostTypeDropdown: React.FC<Props> = ({ className, value, onChange }) => {
   const [isOpen, setIsOpen] = React.useState(false);

   const { t } = useTranslation();

   const rootRef = useClickOutside<HTMLDivElement>(() => {
      setIsOpen(false);
   });

   const currentType =
      createPostTypeOptions.find((option) => option.id === value) ?? createPostTypeOptions[0];

   const currentLabel = t.createPost.postTypes[currentType.translationKey];

   const handleSelect = (nextValue: CreatePostType) => {
      onChange(nextValue);
      setIsOpen(false);
   };

   return (
      <div ref={rootRef} className={clsx(css.post_type, className)}>
         <Button
            type="button"
            variant="grey"
            className={clsx(css.post_type_button, isOpen && css.post_type_button_opened)}
            aria-label={t.createPost.fields.postType}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => setIsOpen((current) => !current)}
         >
            <span>{currentLabel}</span>

            <DropdownArrowIcon />
         </Button>

         {isOpen && (
            <div
               className={css.post_type_dropdown}
               role="listbox"
               aria-label={t.createPost.fields.postType}
            >
               {createPostTypeOptions.map((option) => {
                  const isActive = option.id === value;

                  return (
                     <button
                        key={option.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={clsx(
                           css.post_type_option,
                           isActive && css.post_type_option_active
                        )}
                        onClick={() => handleSelect(option.id)}
                     >
                        {t.createPost.postTypes[option.translationKey]}
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};
