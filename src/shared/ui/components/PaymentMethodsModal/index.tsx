"use client";

import React from "react";

import {
   type PaymentGroupId,
   type PaymentMethod,
   type PaymentMethodId,
   type PaymentRegionId,
   paymentMethods,
   paymentRegions,
} from "./lib/paymentMethods.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Modal } from "shared/ui/base/Modal";

import { Search } from "../Search";

import css from "./PaymentMethodsModal.module.scss";

interface Prop {
   className?: string;
   isOpen: boolean;
   initialSelectedIds?: PaymentMethodId[];
   onClose: () => void;
   onApply?: (selectedIds: PaymentMethodId[]) => void;
}

const PAYMENT_GROUPS: PaymentGroupId[] = ["quickSelect", "cards"];

export const PaymentMethodsModal: React.FC<Prop> = ({
   className,
   isOpen,
   initialSelectedIds = ["anyWallet"],
   onClose,
   onApply,
}) => {
   const { t } = useTranslation();

   const searchInputRef = React.useRef<HTMLInputElement>(null);
   const [searchValue, setSearchValue] = React.useState("");
   const [activeRegion, setActiveRegion] = React.useState<PaymentRegionId>("all");
   const [selectedIds, setSelectedIds] = React.useState<PaymentMethodId[]>(initialSelectedIds);

   React.useEffect(() => {
      if (!isOpen) {
         return;
      }

      setSelectedIds(initialSelectedIds);
      setSearchValue("");
      setActiveRegion("all");
   }, [initialSelectedIds, isOpen]);

   React.useEffect(() => {
      if (!isOpen) {
         return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
         const isSearchShortcut =
            (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

         if (!isSearchShortcut) {
            return;
         }

         event.preventDefault();
         searchInputRef.current?.focus();
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen]);

   const filteredMethods = React.useMemo(() => {
      const normalizedSearch = searchValue.trim().toLocaleLowerCase();

      return paymentMethods.filter((method) => {
         const matchesRegion = activeRegion === "all" || method.regions.includes(activeRegion);

         const methodLabel = t.paymentMethodsModal.methods[method.translationKey];

         const matchesSearch =
            !normalizedSearch || methodLabel.toLocaleLowerCase().includes(normalizedSearch);

         return matchesRegion && matchesSearch;
      });
   }, [activeRegion, searchValue, t.paymentMethodsModal.methods]);

   const toggleMethod = (methodId: PaymentMethodId) => {
      setSelectedIds((current) =>
         current.includes(methodId)
            ? current.filter((id) => id !== methodId)
            : [...current, methodId]
      );
   };

   const handleApply = () => {
      onApply?.(selectedIds);
      onClose?.();
   };

   const selectedMethods = paymentMethods.filter((method) => selectedIds.includes(method.id));

   const selectedLabel = selectedMethods
      .map((method) => t.paymentMethodsModal.methods[method.translationKey])
      .join(", ");

   return (
      <Modal
         isOpen={isOpen}
         variant="modal"
         mobileVariant="bottom-sheet"
         ariaLabel={t.paymentMethodsModal.title}
         contentClassName={clsx(css.payment_methods_modal, className)}
         onClose={onClose}
      >
         <div className={css.payment_methods_modal_content}>
            <header className={css.payment_methods_modal_header}>
               <h2 className={css.payment_methods_modal_title}>{t.paymentMethodsModal.title}</h2>

               <button
                  type="button"
                  aria-label={t.paymentMethodsModal.close}
                  className={css.payment_methods_modal_close}
                  onClick={onClose}
               >
                  <Image.Default src="/icons/close.svg" alt="" />
               </button>
            </header>

            <div className={css.payment_methods_modal_search}>
               <Search
                  placeholder="WeChat, Alipay, USDT, UOI..."
                  aria-label={t.paymentMethodsModal.searchPlaceholder}
                  onChange={(event) => setSearchValue(event.target.value)}
                  ref={searchInputRef}
                  type="search"
                  value={searchValue}
                  className={css.payment_methods_modal_search_input}
               />
            </div>

            <div
               className={css.payment_methods_modal_regions}
               role="tablist"
               aria-label={t.paymentMethodsModal.regionsLabel}
            >
               {paymentRegions.map((region) => {
                  const isActive = activeRegion === region.id;

                  return (
                     <button
                        key={region.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={clsx(
                           css.payment_methods_modal_region,
                           isActive && css.payment_methods_modal_region_active
                        )}
                        onClick={() => setActiveRegion(region.id)}
                     >
                        {t.paymentMethodsModal.regions[region.translationKey]}
                     </button>
                  );
               })}
            </div>

            <div className={css.payment_methods_modal_divider} />

            <div className={css.payment_methods_modal_body}>
               <div className={css.payment_methods_modal_scroll}>
                  {PAYMENT_GROUPS.map((groupId) => {
                     const groupMethods = filteredMethods.filter(
                        (method) => method.group === groupId
                     );

                     if (!groupMethods.length) {
                        return null;
                     }

                     return (
                        <section key={groupId} className={css.payment_methods_modal_group}>
                           <h3 className={css.payment_methods_modal_group_title}>
                              {t.paymentMethodsModal.groups[groupId]}
                           </h3>

                           <div className={css.payment_methods_modal_list}>
                              {groupMethods.map((method) => (
                                 <PaymentMethodRow
                                    key={method.id}
                                    method={method}
                                    checked={selectedIds.includes(method.id)}
                                    label={t.paymentMethodsModal.methods[method.translationKey]}
                                    onChange={() => toggleMethod(method.id)}
                                 />
                              ))}
                           </div>
                        </section>
                     );
                  })}

                  {!filteredMethods.length && (
                     <p className={css.payment_methods_modal_empty}>
                        {t.paymentMethodsModal.nothingFound}
                     </p>
                  )}
               </div>
            </div>

            <footer className={css.payment_methods_modal_footer}>
               <p className={css.payment_methods_modal_selected}>
                  <span>{t.paymentMethodsModal.selected}:</span>

                  {selectedLabel || "—"}
               </p>

               <button
                  type="button"
                  disabled={!selectedIds.length}
                  className={css.payment_methods_modal_apply}
                  onClick={handleApply}
               >
                  {t.paymentMethodsModal.apply.replace("{count}", String(selectedIds.length))}
               </button>
            </footer>
         </div>
      </Modal>
   );
};

interface PaymentMethodRowProps {
   method: PaymentMethod;
   label: string;
   checked: boolean;
   onChange: () => void;
}

const PaymentMethodRow: React.FC<PaymentMethodRowProps> = ({
   method,
   label,
   checked,
   onChange,
}) => {
   return (
      <label className={css.payment_methods_modal_item}>
         <span className={css.payment_methods_modal_checkbox_wrapper}>
            <input type="checkbox" checked={checked} onChange={onChange} />

            <span
               className={clsx(
                  css.payment_methods_modal_checkbox,
                  checked && css.payment_methods_modal_checkbox_checked
               )}
               aria-hidden="true"
            >
               <svg viewBox="0 0 10 8" fill="none">
                  <path
                     d="M1 4L3.6 6.5L9 1"
                     stroke="currentColor"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </span>
         </span>

         <span
            className={clsx(
               css.payment_methods_modal_item_name,
               method.emphasized && css.payment_methods_modal_item_name_emphasized
            )}
         >
            {label}
         </span>

         <span className={css.payment_methods_modal_item_price}>{method.price}</span>
      </label>
   );
};
