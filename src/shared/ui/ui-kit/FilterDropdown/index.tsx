"use client";

import React from "react";

import { clsx } from "clsx";

import { Modal } from "shared/ui/base/Modal";
import { FilterType } from "shared/ui/components/FilterType";
import { FilterTypeData } from "shared/ui/components/FilterType";
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

interface Prop {
   className?: string;
   name: string;
   variant?: "api" | "group" | "forum";
}

export const FilterDropdown: React.FC<Prop> = ({ className, name, variant = "api" }) => {
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
            {variant === "api" ? (
               <FilterType data={aiType} onClose={() => setIsOpen(false)} />
            ) : (
               <FreeTest onClose={() => setIsOpen(false)} />
            )}
         </Modal>
      </>
   );
};
