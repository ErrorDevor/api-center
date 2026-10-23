"use client";

import React from "react";

import type { PaymentMethodId } from "../PaymentMethodsModal/lib/paymentMethods.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { Button } from "shared/ui/ui-kit/Button";
import { Checkbox } from "shared/ui/ui-kit/Checkbox";

import { PaymentMethodsModal } from "../PaymentMethodsModal";
import { Search } from "../Search";

import css from "./FilterType.module.scss";

const MIN_PRICE = 0;
const MAX_PRICE = 300;
const PRICE_STEP = 1;

export interface FilterTypeItem {
   id: string;
   name: string;
   count: number;
}

export interface FilterTypeGroup {
   id: string;
   name: string;
   type: FilterTypeItem[];
}

export type FilterTypeData = FilterTypeGroup[];

// Everything the dropdown lets the user pick. `types` holds
// "<groupId>-<typeId>" ids (see getTypeId).
export interface FilterTypeValue {
   types: string[];
   minPrice: number;
   maxPrice: number;
   isActive: boolean;
   paymentIds: PaymentMethodId[];
}

interface Prop {
   className?: string;
   data: FilterTypeData;
   onClose?: () => void;
   onChoosePayment?: (selectedIds: PaymentMethodId[]) => void;
   // The remaining props let a caller drive a real filter with this UI (the
   // catalog does). Left out, it behaves as before (group-buys: purely
   // visual, "Show" just closes).
   title?: string;
   searchPlaceholder?: string;
   priceLabel?: string;
   priceMax?: number;
   priceStep?: number;
   showStatus?: boolean;
   initialValue?: FilterTypeValue;
   // Number of results the current selection would show — the "Show" button
   // reads it. Without it the button counts the selected items instead.
   getResultCount?: (value: FilterTypeValue) => number;
   onApply?: (value: FilterTypeValue) => void;
}

export const FilterType: React.FC<Prop> = ({
   className,
   data,
   onClose,
   onChoosePayment,
   title,
   searchPlaceholder = "Codex, Max, Team...",
   priceLabel,
   priceMax = MAX_PRICE,
   priceStep = PRICE_STEP,
   showStatus = true,
   initialValue,
   getResultCount,
   onApply,
}) => {
   const [selectedTypes, setSelectedTypes] = React.useState<string[]>(initialValue?.types ?? []);
   const [minPrice, setMinPrice] = React.useState(initialValue?.minPrice ?? MIN_PRICE);
   const [maxPrice, setMaxPrice] = React.useState(initialValue?.maxPrice ?? priceMax);
   const [isActive, setIsActive] = React.useState(initialValue?.isActive ?? false);
   const [query, setQuery] = React.useState("");

   const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
   const [selectedPaymentIds, setSelectedPaymentIds] = React.useState<PaymentMethodId[]>(
      initialValue?.paymentIds ?? []
   );

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

   const { t } = useTranslation();

   const getTypeId = (groupId: string, typeId: string) => {
      return `${groupId}-${typeId}`;
   };

   const toggleType = (typeId: string) => {
      setSelectedTypes((current) => {
         if (current.includes(typeId)) {
            return current.filter((item) => item !== typeId);
         }

         return [...current, typeId];
      });
   };
   const selectedCount = React.useMemo(() => {
      return data.reduce((total, group) => {
         const groupTotal = group.type.reduce((sum, type) => {
            const typeId = getTypeId(group.id, type.id);

            return selectedTypes.includes(typeId) ? sum + type.count : sum;
         }, 0);

         return total + groupTotal;
      }, 0);
   }, [selectedTypes]);

   const minPricePercent = ((minPrice - MIN_PRICE) / (priceMax - MIN_PRICE)) * 100;
   const maxPricePercent = ((maxPrice - MIN_PRICE) / (priceMax - MIN_PRICE)) * 100;

   const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);

      setMinPrice(Math.min(nextValue, maxPrice - priceStep));
   };

   const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);

      setMaxPrice(Math.max(nextValue, minPrice + priceStep));
   };

   const currentValue: FilterTypeValue = {
      types: selectedTypes,
      minPrice,
      maxPrice,
      isActive,
      paymentIds: selectedPaymentIds,
   };

   const handleReset = () => {
      setSelectedTypes([]);
      setMinPrice(MIN_PRICE);
      setMaxPrice(priceMax);
      setIsActive(false);
      setSelectedPaymentIds([]);
      setQuery("");

      onApply?.({
         types: [],
         minPrice: MIN_PRICE,
         maxPrice: priceMax,
         isActive: false,
         paymentIds: [],
      });
   };

   const handleShow = () => {
      onApply?.(currentValue);
      onClose?.();
   };

   const visibleData = React.useMemo(() => {
      const needle = query.trim().toLowerCase();

      if (!needle) {
         return data;
      }

      return data
         .map((group) => ({
            ...group,
            type: group.type.filter((type) => type.name.toLowerCase().includes(needle)),
         }))
         .filter((group) => group.type.length > 0);
   }, [data, query]);

   const shownCount = getResultCount ? getResultCount(currentValue) : selectedCount;

   const paymentButtonLabel =
      selectedPaymentIds.length > 0
         ? `${t.freeTest.choosePayment} (${selectedPaymentIds.length})`
         : t.freeTest.choosePayment;

   return (
      <>
         <div className={clsx(css.account_type, className)}>
            <div className={css.account_type_top}>
               <h6>{title ?? t.filterDropdown.title}</h6>

               <Search
                  placeholder={searchPlaceholder}
                  className={css.search_filter}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
               />

               <ul className={css.ai_type_list}>
                  {visibleData.map((group) => (
                     <li key={group.id} className={css.ai_type_list_item}>
                        <h6>{group.name}</h6>

                        <ul className={css.ai_type_list_items}>
                           {group.type.map((type) => {
                              const typeId = getTypeId(group.id, type.id);
                              const isChecked = selectedTypes.includes(typeId);

                              const handleItemClick = () => {
                                 toggleType(typeId);
                              };

                              const handleCheckboxChange = () => {
                                 toggleType(typeId);
                              };

                              return (
                                 <li key={type.id} className={css.type_items}>
                                    <label className={css.type_items_label}>
                                       <Checkbox
                                          checked={isChecked}
                                          aria-label={type.name}
                                          onChange={() => toggleType(typeId)}
                                       />

                                       <span>{type.name}</span>

                                       <div className={css.count}>{type.count}</div>
                                    </label>
                                 </li>
                              );
                           })}
                        </ul>
                     </li>
                  ))}
               </ul>
            </div>

            <div className={css.divider} />

            <div className={css.filter_block}>
               <p>{priceLabel ?? t.filterDropdown.price}</p>

               <div className={css.price_values}>
                  <span>${minPrice}</span>
                  <span>${maxPrice}</span>
               </div>

               <div
                  className={css.price_range}
                  style={
                     {
                        "--range-start": `${minPricePercent}%`,
                        "--range-end": `${maxPricePercent}%`,
                     } as React.CSSProperties
                  }
               >
                  <div className={css.price_range_track} />

                  <input
                     type="range"
                     min={MIN_PRICE}
                     max={priceMax}
                     step={priceStep}
                     value={minPrice}
                     aria-label="Minimum price"
                     className={clsx(css.price_range_input, css.price_range_input_min)}
                     onChange={handleMinPriceChange}
                  />

                  <input
                     type="range"
                     min={MIN_PRICE}
                     max={priceMax}
                     step={priceStep}
                     value={maxPrice}
                     aria-label="Maximum price"
                     className={clsx(css.price_range_input, css.price_range_input_max)}
                     onChange={handleMaxPriceChange}
                  />
               </div>
            </div>

            {showStatus && (
               <>
                  <div className={css.divider} />

                  <div className={css.filter_block}>
                     <p>{t.filterDropdown.status}</p>

                     <label className={css.filter_block_active}>
                        <Checkbox
                           checked={isActive}
                           aria-label={t.filterDropdown.active}
                           onChange={(event) => setIsActive(event.target.checked)}
                        />

                        <span>{t.filterDropdown.active}</span>
                     </label>
                  </div>
               </>
            )}

            <div className={css.divider} />

            <div className={css.filter_block}>
               <p>{t.filterDropdown.payment}</p>

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
               <button className={css.cancel_button} type="button" onClick={handleReset}>
                  {t.filterDropdown.buttonCancel}
               </button>

               <Button
                  type="button"
                  variant="blue"
                  className={css.show_button}
                  onClick={handleShow}
                  disabled={!getResultCount && selectedCount === 0}
               >
                  {t.filterDropdown.buttonShow}
                  <span>({shownCount})</span>
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
