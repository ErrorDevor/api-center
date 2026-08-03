"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";

import css from "./ModelPostFields.module.scss";

interface Props {
   price: string;
   personsCount: string;
   onPriceChange: (value: string) => void;
   onPersonsCountChange: (value: string) => void;
}

export const ModelPostFields: React.FC<Props> = ({
   price,
   personsCount,
   onPriceChange,
   onPersonsCountChange,
}) => {
   const { t } = useTranslation();

   const handlePriceChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const nextValue = event.target.value.replace(
         /[^\d.,]/g,
         ""
      );

      onPriceChange(nextValue);
   };

   const handlePersonsCountChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const nextValue = event.target.value.replace(/\D/g, "");

      onPersonsCountChange(nextValue);
   };

   return (
      <div className={css.model_post_fields}>
         <input
            type="text"
            inputMode="decimal"
            value={price}
            placeholder={t.createPost.fields.pricePlaceholder}
            aria-label={t.createPost.fields.pricePlaceholder}
            className={css.model_post_fields_price}
            onChange={handlePriceChange}
         />

         <input
            type="text"
            inputMode="numeric"
            value={personsCount}
            placeholder={
               t.createPost.fields.personsPlaceholder
            }
            aria-label={
               t.createPost.fields.personsPlaceholder
            }
            className={css.model_post_fields_persons}
            onChange={handlePersonsCountChange}
         />
      </div>
   );
};