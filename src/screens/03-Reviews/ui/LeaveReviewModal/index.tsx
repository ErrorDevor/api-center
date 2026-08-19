"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Modal } from "shared/ui/base/Modal";
import { Reply } from "shared/ui/components/Reply";
import { Checkbox } from "shared/ui/ui-kit/Checkbox";

import css from "./LeaveReviewModal.module.scss";

interface Prop {
   isOpen: boolean;
   isSubmitting: boolean;
   onClose: () => void;
   onSubmit: (content: string, sentiment: "positive" | "negative") => void;
}

// POST /providers/:provider/comments (COMMENTS_API_GUIDE.md §2) needs a
// sentiment alongside the free-text content — this is the compose form for
// that, opened by Comments' "feedback" button. Only rendered for
// authenticated users (Comments redirects to /login before opening it).
export const LeaveReviewModal: React.FC<Prop> = ({
   isOpen,
   isSubmitting,
   onClose,
   onSubmit,
}) => {
   const { t } = useTranslation();
   const [sentiment, setSentiment] = React.useState<"positive" | "negative">("positive");

   React.useEffect(() => {
      if (isOpen) {
         setSentiment("positive");
      }
   }, [isOpen]);

   return (
      <Modal
         isOpen={isOpen}
         variant="modal"
         mobileVariant="bottom-sheet"
         ariaLabel={t.groupBuys.leaveReview.title}
         contentClassName={css.leave_review_modal}
         onClose={onClose}
      >
         <div className={css.leave_review_modal_content}>
            <header className={css.leave_review_modal_header}>
               <h2 className={css.leave_review_modal_title}>{t.groupBuys.leaveReview.title}</h2>

               <button
                  type="button"
                  aria-label={t.paymentMethodsModal.close}
                  className={css.leave_review_modal_close}
                  onClick={onClose}
               >
                  <Image.Default src="/icons/close.svg" alt="" />
               </button>
            </header>

            <div className={css.leave_review_modal_sentiment}>
               <Checkbox
                  variant="radio"
                  name="review-sentiment"
                  value="positive"
                  checked={sentiment === "positive"}
                  label={t.groupBuys.leaveReview.positive}
                  onChange={() => setSentiment("positive")}
               />

               <Checkbox
                  variant="radio"
                  name="review-sentiment"
                  value="negative"
                  checked={sentiment === "negative"}
                  label={t.groupBuys.leaveReview.negative}
                  onChange={() => setSentiment("negative")}
               />
            </div>

            <Reply
               placeholder={t.groupBuys.leaveReview.placeholder}
               buttonText={t.groupBuys.leaveReview.submit}
               disabled={isSubmitting}
               onSubmit={(content) => onSubmit(content, sentiment)}
            />
         </div>
      </Modal>
   );
};
