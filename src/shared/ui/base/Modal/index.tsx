"use client";

import React from "react";
import { createPortal } from "react-dom";

import type { DropdownPlacement, ModalProps } from "./lib/Modal.types";
import clsx from "clsx";

import css from "./Modal.module.scss";

interface Position {
   left: number;
   top: number;
}

const getDropdownPosition = (
   anchorRect: DOMRect,
   modalRect: DOMRect,
   placement: DropdownPlacement,
   gap: number,
   viewportPadding: number
): Position => {
   let left = anchorRect.left;
   let top = anchorRect.bottom + gap;

   switch (placement) {
      case "bottom-start":
         left = anchorRect.left;
         top = anchorRect.bottom + gap;
         break;

      case "bottom-end":
         left = anchorRect.right - modalRect.width;
         top = anchorRect.bottom + gap;
         break;

      case "top-start":
         left = anchorRect.left;
         top = anchorRect.top - modalRect.height - gap;
         break;

      case "top-end":
         left = anchorRect.right - modalRect.width;
         top = anchorRect.top - modalRect.height - gap;
         break;

      case "left":
         left = anchorRect.left - modalRect.width - gap;
         top = anchorRect.top + anchorRect.height / 2 - modalRect.height / 2;
         break;

      case "right":
         left = anchorRect.right + gap;
         top = anchorRect.top + anchorRect.height / 2 - modalRect.height / 2;
         break;
   }

   const maxLeft = window.innerWidth - modalRect.width - viewportPadding;
   const maxTop = window.innerHeight - modalRect.height - viewportPadding;

   return {
      left: Math.min(Math.max(viewportPadding, left), Math.max(viewportPadding, maxLeft)),
      top: Math.min(Math.max(viewportPadding, top), Math.max(viewportPadding, maxTop)),
   };
};

export const Modal: React.FC<ModalProps> = ({
   isOpen,
   onClose,
   children,
   variant = "modal",
   className,
   contentClassName,
   anchorRef,
   placement = "bottom-start",
   gap = 8,
   viewportPadding = 8,
   closeOnOverlay = true,
   closeOnOutsideClick = true,
   closeOnEscape = true,
   ariaLabel,
   ariaLabelledBy,
}) => {
   const contentRef = React.useRef<HTMLDivElement>(null);

   const [mounted, setMounted] = React.useState(false);
   const [position, setPosition] = React.useState<Position>({
      left: 0,
      top: 0,
   });
   const [isPositioned, setIsPositioned] = React.useState(variant === "modal");

   React.useEffect(() => {
      setMounted(true);

      return () => {
         setMounted(false);
      };
   }, []);

   const updateDropdownPosition = React.useCallback(() => {
      if (variant !== "dropdown" || !anchorRef?.current || !contentRef.current) {
         return;
      }

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const modalRect = contentRef.current.getBoundingClientRect();
      const nextPosition = getDropdownPosition(
         anchorRect,
         modalRect,
         placement,
         gap,
         viewportPadding
      );

      setPosition(nextPosition);
      setIsPositioned(true);
   }, [anchorRef, gap, placement, variant, viewportPadding]);

   React.useLayoutEffect(() => {
      if (!isOpen || variant !== "dropdown") {
         return;
      }

      setIsPositioned(false);
      updateDropdownPosition();

      const animationFrame = requestAnimationFrame(updateDropdownPosition);

      return () => {
         cancelAnimationFrame(animationFrame);
      };
   }, [isOpen, updateDropdownPosition, variant, children]);

   React.useEffect(() => {
      if (!isOpen || variant !== "dropdown") {
         return;
      }

      const handlePositionUpdate = () => {
         updateDropdownPosition();
      };

      window.addEventListener("resize", handlePositionUpdate);
      window.addEventListener("scroll", handlePositionUpdate, true);

      return () => {
         window.removeEventListener("resize", handlePositionUpdate);
         window.removeEventListener("scroll", handlePositionUpdate, true);
      };
   }, [isOpen, updateDropdownPosition, variant]);

   React.useEffect(() => {
      if (!isOpen || !closeOnEscape) {
         return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key !== "Escape") {
            return;
         }

         event.preventDefault();
         event.stopImmediatePropagation();
         onClose();
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [closeOnEscape, isOpen, onClose]);

   React.useEffect(() => {
      if (!isOpen || variant !== "dropdown" || !closeOnOutsideClick) {
         return;
      }

      const handlePointerDown = (event: PointerEvent) => {
         const target = event.target as Node;

         const isInsideContent = contentRef.current?.contains(target);

         const isInsideAnchor = anchorRef?.current?.contains(target);

         if (!isInsideContent && !isInsideAnchor) {
            onClose();
         }
      };

      document.addEventListener("pointerdown", handlePointerDown);

      return () => {
         document.removeEventListener("pointerdown", handlePointerDown);
      };
   }, [anchorRef, closeOnOutsideClick, isOpen, onClose, variant]);

   React.useEffect(() => {
      if (!isOpen || variant !== "modal") {
         return;
      }

      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
         document.body.style.overflow = previousOverflow;
      };
   }, [isOpen, variant]);

   if (!mounted || !isOpen) {
      return null;
   }

   if (variant === "dropdown" && !anchorRef) {
      console.error('Modal: "anchorRef" is required for the "dropdown" variant.');

      return null;
   }

   const content = (
      <div
         className={clsx(css.modal, css[`modal_${variant}`], className)}
         onPointerDown={(event) => {
            if (variant === "modal") {
               event.stopPropagation();
            }
         }}
      >
         {variant === "modal" && (
            <button
               type="button"
               className={css.modal_overlay}
               aria-label="Close modal"
               tabIndex={-1}
               onClick={closeOnOverlay ? onClose : undefined}
            />
         )}

         <div
            ref={contentRef}
            role={variant === "modal" ? "dialog" : undefined}
            aria-modal={variant === "modal" ? true : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={clsx(css.modal_content, css[`modal_content_${variant}`], contentClassName)}
            style={
               variant === "dropdown"
                  ? {
                       left: position.left,
                       top: position.top,
                       visibility: isPositioned ? "visible" : "hidden",
                    }
                  : undefined
            }
         >
            {children}
         </div>
      </div>
   );

   return createPortal(content, document.body);
};

export type { DropdownPlacement, ModalProps, ModalVariant } from "./lib/Modal.types";
