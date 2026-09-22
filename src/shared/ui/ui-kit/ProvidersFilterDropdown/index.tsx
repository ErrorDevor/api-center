"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import { Modal } from "shared/ui/base/Modal";
import { Button } from "shared/ui/ui-kit/Button";
import { Checkbox } from "shared/ui/ui-kit/Checkbox";

import css from "./ProvidersFilterDropdown.module.scss";

export type ProviderStatusFilter = "all" | "working" | "not-working";

interface Prop {
   isOpen: boolean;
   anchorRef: React.RefObject<HTMLButtonElement | null>;
   value: ProviderStatusFilter;
   onApply: (value: ProviderStatusFilter) => void;
   onClose: () => void;
}

export const ProvidersFilterDropdown: React.FC<Prop> = ({
   isOpen,
   anchorRef,
   value,
   onApply,
   onClose,
}) => {
   const { t } = useTranslation();

   const [currentValue, setCurrentValue] = React.useState<ProviderStatusFilter>(value);

   React.useEffect(() => {
      if (isOpen) {
         setCurrentValue(value);
      }
   }, [isOpen, value]);

   const options: {
      value: ProviderStatusFilter;
      label: string;
   }[] = [
      {
         value: "all",
         label: t.aiProviders.filters.all,
      },
      {
         value: "working",
         label: t.aiProviders.filters.working,
      },
      {
         value: "not-working",
         label: t.aiProviders.filters.notWorking,
      },
   ];

   const handleReset = () => {
      setCurrentValue("all");
   };

   const handleApply = () => {
      onApply(currentValue);
      onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         variant="dropdown"
         mobileVariant="bottom-sheet"
         anchorRef={anchorRef}
         placement="bottom-end"
         gap={8}
         contentClassName={css.filter_dropdown}
         onClose={onClose}
      >
         <div className={css.filter}>
            <div className={css.filter_content}>
               <span className={css.filter_title}>{t.aiProviders.filters.status}</span>

               <ul
                  className={css.filter_list}
                  role="radiogroup"
                  aria-label={t.aiProviders.filters.status}
               >
                  {options.map((option) => (
                     <li key={option.value} className={css.filter_list_item}>
                        <Checkbox
                           variant="radio"
                           name="provider-status"
                           value={option.value}
                           checked={currentValue === option.value}
                           label={option.label}
                           className={css.filter_option}
                           onChange={() => setCurrentValue(option.value)}
                        />
                     </li>
                  ))}
               </ul>
            </div>

            <div className={css.filter_footer}>
               <button type="button" className={css.filter_reset} onClick={handleReset}>
                  {t.aiProviders.filters.reset}
               </button>

               <Button type="button" variant="blue" className={css.filter_apply} onClick={handleApply}>
                  {t.aiProviders.filters.show}
               </Button>
            </div>
         </div>
      </Modal>
   );
};
