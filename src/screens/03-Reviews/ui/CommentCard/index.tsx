"use client";

import React from "react";

import clsx from "clsx";
import type { CommentProviderDetails } from "screens/03-Reviews/lib/comments.type";

import { CommentCardOptions } from "../CommentCardOptions";

import css from "./CommentCard.module.scss";

interface Prop {
   className?: string;
   providerName: string;
   description: string;
   providerDetails: CommentProviderDetails;
}

// Renders one provider's summary card: name, description (both real data,
// resolved by the Comments screen from providers.json/provider_descriptions
// .json — see useProviderRecords/useProviderDescriptions), plus the
// link/rating/payment-methods/top-models panel (CommentCardOptions).
export const CommentCard: React.FC<Prop> = ({
   className,
   providerName,
   description,
   providerDetails,
}) => {
   return (
      <div className={clsx(css.comment_card, className)}>
         <div className={css.comment_card_content}>
            <div className={css.comment_card_main}>
               <h3 className={css.comment_card_title}>{providerName}</h3>

               {description && (
                  <div className={css.comment_card_description}>
                     <span className={css.comment_card_description_mark} />
                     <p>{description}</p>
                  </div>
               )}

               <CommentCardOptions data={providerDetails} />
            </div>
         </div>
      </div>
   );
};
