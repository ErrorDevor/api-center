import React from "react";

export type ModalVariant = "modal" | "dropdown";

export type ModalMobileVariant = "bottom-sheet";

export type DropdownPlacement =
   "bottom-start" | "bottom-end" | "top-start" | "top-end" | "left" | "right";

export interface ModalProps {
   isOpen: boolean;
   children: React.ReactNode;
   variant?: ModalVariant;
   mobileVariant?: ModalMobileVariant;
   className?: string;
   contentClassName?: string;
   anchorRef?: React.RefObject<HTMLElement | null>;
   placement?: DropdownPlacement;
   gap?: number;
   viewportPadding?: number;
   closeOnOverlay?: boolean;
   closeOnOutsideClick?: boolean;
   closeOnEscape?: boolean;
   ariaLabel?: string;
   ariaLabelledBy?: string;
   onClose: () => void;
}
