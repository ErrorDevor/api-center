"use client";

import React from "react";

import { type CreatePostData, type CreatePostType } from "../../lib/createPost.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";

import { ModelPostFields } from "../ModelPostFields";
import { PostEditorActions } from "../PostEditorActions";
import { PostTypeDropdown } from "../PostTypeDropdown";

import css from "./CreatePostForm.module.scss";

interface Prop {
   className?: string;
   onSubmit?: (data: CreatePostData) => void;
}

export const CreatePostForm: React.FC<Prop> = ({ className, onSubmit }) => {
   const { t } = useTranslation();

   const [postType, setPostType] = React.useState<CreatePostType>("discussion");

   const [title, setTitle] = React.useState("");
   const [description, setDescription] = React.useState("");

   const [price, setPrice] = React.useState("");
   const [personsCount, setPersonsCount] = React.useState("");

   const normalizedTitle = title.trim();
   const normalizedDescription = description.trim();

   const hasTitle = normalizedTitle.length > 0;
   const hasDescription = normalizedDescription.length > 0;

   const hasModelFields =
      postType === "discussion" || (price.trim().length > 0 && personsCount.trim().length > 0);

   const isSubmitDisabled = !hasTitle || !hasDescription || !hasModelFields;

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitDisabled) {
         return;
      }

      const commonData = {
         title: normalizedTitle,
         description: normalizedDescription,
         tags: [],
      };

      const postData: CreatePostData =
         postType === "model"
            ? {
                 ...commonData,
                 type: "model",
                 modelId: "openai",
                 price: price.trim(),
                 personsCount: personsCount.trim(),
              }
            : {
                 ...commonData,
                 type: "discussion",
              };

      onSubmit?.(postData);

      console.log("Create post:", postData);
   };

   return (
      <form className={clsx(css.create_post_form, className)} onSubmit={handleSubmit}>
         <div className={css.create_post_form_card}>
            <div className={css.create_post_form_top}>
               <PostTypeDropdown value={postType} onChange={setPostType} />

               {postType === "model" && (
                  <ModelPostFields
                     price={price}
                     personsCount={personsCount}
                     onPriceChange={setPrice}
                     onPersonsCountChange={setPersonsCount}
                  />
               )}
            </div>

            <label className={css.create_post_form_title}>
               <span>
                  {t.createPost.fields.title}

                  <strong aria-hidden="true">*</strong>
               </span>

               <input
                  type="text"
                  value={title}
                  aria-required="true"
                  onChange={(event) => setTitle(event.target.value)}
               />
            </label>

            <textarea
               value={description}
               placeholder={t.createPost.fields.descriptionPlaceholder}
               className={css.create_post_form_description}
               onChange={(event) => setDescription(event.target.value)}
            />

            <PostEditorActions submitDisabled={isSubmitDisabled} />
         </div>
      </form>
   );
};
