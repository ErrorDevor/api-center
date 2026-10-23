"use client";

import React from "react";

import { clsx } from "clsx";

import { Modal } from "shared/ui/base/Modal";
import { FilterType } from "shared/ui/components/FilterType";
import { FilterTypeData, type FilterTypeValue } from "shared/ui/components/FilterType";
import { FreeTest } from "shared/ui/components/FreeTest";
import { FilterIcon } from "shared/ui/icons";

import { Button } from "../Button";

import css from "./FilterDropdown.module.scss";

const aiType: FilterTypeData = [
   {
      id: "chatgpt",
      name: "ChatGPT",
      type: [
         { id: "plus", name: "Plus", count: 40 },
         { id: "pro", name: "Pro", count: 40 },
         { id: "team", name: "Team", count: 32 },
         { id: "enterprise", name: "Enterprise", count: 18 },
         { id: "codex", name: "Codex", count: 24 },
      ],
   },
   {
      id: "claude",
      name: "Claude",
      type: [
         { id: "pro", name: "Pro", count: 40 },
         { id: "max-5x", name: "Max 5x", count: 28 },
         { id: "max-20x", name: "Max 20x", count: 19 },
         { id: "team", name: "Team", count: 25 },
      ],
   },
   {
      id: "google",
      name: "Google",
      type: [
         { id: "gemini-advanced", name: "Gemini Advanced", count: 34 },
         { id: "google-ai-pro", name: "Google AI Pro", count: 26 },
         { id: "google-ai-ultra", name: "Google AI Ultra", count: 14 },
      ],
   },
   {
      id: "microsoft",
      name: "Microsoft",
      type: [
         { id: "copilot-pro", name: "Copilot Pro", count: 31 },
         { id: "github-copilot", name: "GitHub Copilot", count: 38 },
         {
            id: "github-copilot-business",
            name: "GitHub Copilot Business",
            count: 16,
         },
      ],
   },
   {
      id: "other",
      name: "Other",
      type: [
         { id: "perplexity-pro", name: "Perplexity Pro", count: 29 },
         { id: "cursor-pro", name: "Cursor Pro", count: 36 },
         { id: "windsurf-pro", name: "Windsurf Pro", count: 21 },
         { id: "midjourney", name: "Midjourney", count: 27 },
      ],
   },
];

// A real, caller-driven filter (the catalog's) in place of group-buys'
// visual-only one — see FilterType's matching props.
export interface FilterDropdownConfig {
   title: string;
   searchPlaceholder: string;
   priceLabel: string;
   priceMax: number;
   priceStep: number;
   // Defaults to hidden (the catalog has no seat availability).
   showStatus?: boolean;
   // Both default to shown (group-buys); the catalog hides them.
   showSearch?: boolean;
   showPayment?: boolean;
   data: FilterTypeData;
   value: FilterTypeValue;
   getResultCount: (value: FilterTypeValue) => number;
   onApply: (value: FilterTypeValue) => void;
   // Shown as a dot on the button while a filter is applied.
   isActive: boolean;
}

interface Prop {
   className?: string;
   name: string;
   variant?: "api" | "group" | "group-buys" | "forum";
   config?: FilterDropdownConfig;
}

export const FilterDropdown: React.FC<Prop> = ({ className, name, variant = "api", config }) => {
   const buttonRef = React.useRef<HTMLButtonElement>(null);
   const [isOpen, setIsOpen] = React.useState(false);

   return (
      <>
         <Button
            ref={buttonRef}
            type="button"
            variant="grey"
            className={clsx(css.filter_button, className)}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
         >
            <FilterIcon />
            {name}

            {config?.isActive && <span className={css.filter_dot} aria-hidden="true" />}
         </Button>

         <Modal
            isOpen={isOpen}
            variant="dropdown"
            mobileVariant="bottom-sheet"
            anchorRef={buttonRef}
            placement="bottom-end"
            contentClassName={css.account_type_modal}
            onClose={() => setIsOpen(false)}
         >
            {/* Account-type filter is group-buys only. */}
            {config ? (
               <FilterType
                  data={config.data}
                  title={config.title}
                  searchPlaceholder={config.searchPlaceholder}
                  priceLabel={config.priceLabel}
                  priceMax={config.priceMax}
                  priceStep={config.priceStep}
                  showStatus={config.showStatus ?? false}
                  showSearch={config.showSearch ?? true}
                  showPayment={config.showPayment ?? true}
                  initialValue={config.value}
                  getResultCount={config.getResultCount}
                  onApply={config.onApply}
                  onClose={() => setIsOpen(false)}
               />
            ) : variant === "group-buys" ? (
               <FilterType data={aiType} onClose={() => setIsOpen(false)} />
            ) : (
               <FreeTest onClose={() => setIsOpen(false)} />
            )}
         </Modal>
      </>
   );
};
