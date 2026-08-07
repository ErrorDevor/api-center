"use client";

import React from "react";
import { createPortal } from "react-dom";

import type { DropdownPlacement, ModalProps } from "./lib/Modal.types";
import clsx from "clsx";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";

import css from "./Modal.module.scss";

interface Position {
   left: number;
   top: number;
}

const BOTTOM_SHEET_CLOSE_DISTANCE = 120;
const BOTTOM_SHEET_CLOSE_VELOCITY = 0.5;

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
   mobileVariant,
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
   const isMobile = useIsMobile();

   const contentRef = React.useRef<HTMLDivElement>(null);
   const dragStartYRef = React.useRef(0);
   const dragStartTimeRef = React.useRef(0);
   const dragOffsetRef = React.useRef(0);
   const isDraggingRef = React.useRef(false);

   const [mounted, setMounted] = React.useState(false);
   const [dragOffset, setDragOffset] = React.useState(0);
   const [isDragging, setIsDragging] = React.useState(false);
   const [position, setPosition] = React.useState<Position>({
      left: 0,
      top: 0,
   });
   const [isPositioned, setIsPositioned] = React.useState(variant === "modal");

   const isBottomSheet = isMobile && mobileVariant === "bottom-sheet";
   const isOverlayVariant = variant === "modal" || isBottomSheet;
   const isDropdownVariant = variant === "dropdown" && !isBottomSheet;

   React.useEffect(() => {
      setMounted(true);

      return () => {
         setMounted(false);
      };
   }, []);

   React.useEffect(() => {
      if (!isOpen) {
         setDragOffset(0);
         setIsDragging(false);
         dragOffsetRef.current = 0;
         isDraggingRef.current = false;
      }
   }, [isOpen]);

   const updateDropdownPosition = React.useCallback(() => {
      if (!isDropdownVariant || !anchorRef?.current || !contentRef.current) {
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
   }, [anchorRef, gap, isDropdownVariant, placement, viewportPadding]);

   React.useLayoutEffect(() => {
      if (!isOpen || !isDropdownVariant) {
         return;
      }

      setIsPositioned(false);
      updateDropdownPosition();

      const animationFrame = requestAnimationFrame(updateDropdownPosition);

      return () => {
         cancelAnimationFrame(animationFrame);
      };
   }, [children, isDropdownVariant, isOpen, updateDropdownPosition]);

   React.useEffect(() => {
      if (!isOpen || !isDropdownVariant) {
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
   }, [isDropdownVariant, isOpen, updateDropdownPosition]);

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
      if (!isOpen || !isDropdownVariant || !closeOnOutsideClick) {
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
   }, [anchorRef, closeOnOutsideClick, isDropdownVariant, isOpen, onClose]);

   React.useEffect(() => {
      if (!isOpen || !isOverlayVariant) {
         return;
      }

      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
         document.body.style.overflow = previousOverflow;
      };
   }, [isOpen, isOverlayVariant]);

   const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isBottomSheet) {
         return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);

      dragStartYRef.current = event.clientY;
      dragStartTimeRef.current = performance.now();
      dragOffsetRef.current = 0;
      isDraggingRef.current = true;

      setIsDragging(true);
   };

   const handleDragMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDraggingRef.current) {
         return;
      }

      const nextOffset = Math.max(0, event.clientY - dragStartYRef.current);

      dragOffsetRef.current = nextOffset;
      setDragOffset(nextOffset);
   };

   const handleDragEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDraggingRef.current) {
         return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
         event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const elapsedTime = Math.max(performance.now() - dragStartTimeRef.current, 1);

      const velocity = dragOffsetRef.current / elapsedTime;

      isDraggingRef.current = false;
      setIsDragging(false);

      const shouldClose =
         dragOffsetRef.current >= BOTTOM_SHEET_CLOSE_DISTANCE ||
         velocity >= BOTTOM_SHEET_CLOSE_VELOCITY;

      if (shouldClose) {
         onClose();
         return;
      }

      dragOffsetRef.current = 0;
      setDragOffset(0);
   };

   if (!mounted || !isOpen) {
      return null;
   }

   if (isDropdownVariant && !anchorRef) {
      console.error('Modal: "anchorRef" is required for the "dropdown" variant.');

      return null;
   }

   const content = (
      <div
         className={clsx(
            css.modal,
            css[`modal_${variant}`],
            isBottomSheet && css.modal_bottom_sheet,
            className
         )}
         onPointerDown={(event) => {
            if (isOverlayVariant) {
               event.stopPropagation();
            }
         }}
      >
         {isOverlayVariant && (
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
            role={isOverlayVariant ? "dialog" : undefined}
            aria-modal={isOverlayVariant ? true : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={clsx(
               css.modal_content,
               css[`modal_content_${variant}`],
               isBottomSheet && css.modal_content_bottom_sheet,
               isDragging && css.modal_content_dragging,
               contentClassName
            )}
            style={
               isBottomSheet
                  ? {
                       transform: `translateY(${dragOffset}px)`,
                    }
                  : isDropdownVariant
                    ? {
                         left: position.left,
                         top: position.top,
                         visibility: isPositioned ? "visible" : "hidden",
                      }
                    : undefined
            }
         >
            {isBottomSheet && (
               <button
                  type="button"
                  className={css.modal_drag_handle}
                  aria-label="Close panel"
                  onPointerDown={handleDragStart}
                  onPointerMove={handleDragMove}
                  onPointerUp={handleDragEnd}
                  onPointerCancel={handleDragEnd}
               >
                  <span />
               </button>
            )}

            <div className={clsx(isBottomSheet && css.modal_bottom_sheet_body)}>{children}</div>
         </div>
      </div>
   );

   return createPortal(content, document.body);
};

export type {
   DropdownPlacement,
   ModalMobileVariant,
   ModalProps,
   ModalVariant,
} from "./lib/Modal.types";
