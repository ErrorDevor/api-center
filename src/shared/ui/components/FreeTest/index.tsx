"use client";

import React from "react";

import type { PaymentMethodId } from "../PaymentMethodsModal/lib/paymentMethods.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { Button } from "shared/ui/ui-kit/Button";
import { Toggle } from "shared/ui/ui-kit/Toggle";

import { Dropdown, type DropdownItem } from "../Dropdown";
import { PaymentMethodsModal } from "../PaymentMethodsModal";

import css from "./FreeTest.module.scss";

type RatingValue = "any" | "5" | "4" | "3";
type ReviewsValue = "any" | "10" | "25" | "50" | "100";

interface Prop {
   className?: string;
   resultCount?: number;
   onClose?: () => void;
   onChoosePayment?: (selectedIds: PaymentMethodId[]) => void;
}

export const FreeTest: React.FC<Prop> = ({
   className,
   resultCount = 50,
   onClose,
   onChoosePayment,
}) => {
   const { t } = useTranslation();

   const [hasTrial, setHasTrial] = React.useState(false);
   const [rating, setRating] = React.useState<RatingValue>("any");
   const [reviews, setReviews] = React.useState<ReviewsValue>("any");

   const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

   const [selectedPaymentIds, setSelectedPaymentIds] = React.useState<PaymentMethodId[]>([]);

   const ratingOptions: DropdownItem<RatingValue>[] = [
      {
         value: "any",
         label: t.freeTest.ratingOptions.any,
      },
      {
         value: "5",
         label: t.freeTest.ratingOptions.five,
      },
      {
         value: "4",
         label: t.freeTest.ratingOptions.four,
      },
      {
         value: "3",
         label: t.freeTest.ratingOptions.three,
      },
   ];

   const reviewsOptions: DropdownItem<ReviewsValue>[] = [
      {
         value: "any",
         label: t.freeTest.reviewsOptions.any,
      },
      {
         value: "10",
         label: t.freeTest.reviewsOptions.ten,
      },
      {
         value: "25",
         label: t.freeTest.reviewsOptions.twentyFive,
      },
      {
         value: "50",
         label: t.freeTest.reviewsOptions.fifty,
      },
      {
         value: "100",
         label: t.freeTest.reviewsOptions.hundred,
      },
   ];

   const handleOpenPaymentModal = () => {
      setIsPaymentModalOpen(true);
   };

   const handleClosePaymentModal = () => {
      setIsPaymentModalOpen(false);
   };

   const handleApplyPaymentMethods = (selectedIds: PaymentMethodId[]) => {
      setSelectedPaymentIds(selectedIds);
      onChoosePayment?.(selectedIds);
   };

   const handleReset = () => {
      setHasTrial(false);
      setRating("any");
      setReviews("any");
      setSelectedPaymentIds([]);
   };

   const handleShow = () => {
      const filters = {
         hasTrial,
         rating,
         reviews,
         paymentMethods: selectedPaymentIds,
      };

      console.log("Free test filters:", filters);

      onClose?.();
   };

   const paymentButtonLabel =
      selectedPaymentIds.length > 0
         ? `${t.freeTest.choosePayment} (${selectedPaymentIds.length})`
         : t.freeTest.choosePayment;

   return (
      <>
         <div className={clsx(css.free_test, className)}>
            <div className={css.free_test_top}>
               <h6>{t.freeTest.title}</h6>

               <div className={css.free_test_toggle_block}>
                  <Toggle checked={hasTrial} ariaLabel={t.freeTest.trial} onChange={setHasTrial} />

                  <p>{t.freeTest.trial}</p>
               </div>
            </div>

            <div className={css.divider} />

            <div className={css.filter_block}>
               <p>{t.freeTest.rating}</p>

               <Dropdown
                  items={ratingOptions}
                  value={rating}
                  ariaLabel={t.freeTest.rating}
                  className={css.filter_dropdown}
                  onChange={setRating}
               />
            </div>

            <div className={css.divider} />

            <div className={css.filter_block}>
               <p>{t.freeTest.reviews}</p>

               <Dropdown
                  items={reviewsOptions}
                  value={reviews}
                  ariaLabel={t.freeTest.reviews}
                  className={css.filter_dropdown}
                  onChange={setReviews}
               />
            </div>

            <div className={css.divider} />

            <div className={css.filter_block}>
               <p>{t.freeTest.payment}</p>

               <Button
                  type="button"
                  variant="grey"
                  className={css.choose_payments_button}
                  onClick={handleOpenPaymentModal}
               >
                  {paymentButtonLabel}
               </Button>
            </div>

            <div className={css.divider} />

            <div className={css.buttons_block}>
               <button type="button" className={css.cancel_button} onClick={handleReset}>
                  {t.filterDropdown.buttonCancel}
               </button>

               <Button
                  type="button"
                  variant="blue"
                  className={css.show_button}
                  disabled={resultCount === 0}
                  onClick={handleShow}
               >
                  {t.filterDropdown.buttonShow}

                  <span>({resultCount})</span>
               </Button>
            </div>
         </div>

         <PaymentMethodsModal
            isOpen={isPaymentModalOpen}
            initialSelectedIds={selectedPaymentIds}
            onClose={handleClosePaymentModal}
            onApply={handleApplyPaymentMethods}
         />
      </>
   );
};
