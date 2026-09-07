"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Modal } from "shared/ui/base/Modal";
import { Reply } from "shared/ui/components/Reply";

import css from "./CreateTopicModal.module.scss";

interface Prop {
   isOpen: boolean;
   isSubmitting: boolean;
   error?: boolean;
   onClose: () => void;
   onSubmit: (title: string, content: string) => void;
}

// POST /forum/topics (FORUM_API_GUIDE.md §2) needs a title alongside the
// free-text content — this is the compose form for that, opened by the
// "New topic" button in the /discussions header. Only rendered for
// authenticated users (TopicsScreen redirects to /login before opening it).
export const CreateTopicModal: React.FC<Prop> = ({
   isOpen,
   isSubmitting,
   error,
   onClose,
   onSubmit,
}) => {
   const { t } = useTranslation();
   const [title, setTitle] = React.useState("");

   React.useEffect(() => {
      if (isOpen) {
         setTitle("");
      }
   }, [isOpen]);

   const normalizedTitle = title.trim();

   const handleSubmit = (content: string) => {
      if (!normalizedTitle) {
         return;
      }

      onSubmit(normalizedTitle, content);
   };

   return (
      <Modal
         isOpen={isOpen}
         variant="modal"
         mobileVariant="bottom-sheet"
         ariaLabel={t.forum.newTopic.title}
         contentClassName={css.create_topic_modal}
         onClose={onClose}
      >
         <div className={css.create_topic_modal_content}>
            <header className={css.create_topic_modal_header}>
               <h2 className={css.create_topic_modal_title}>{t.forum.newTopic.title}</h2>

               <button
                  type="button"
                  aria-label={t.paymentMethodsModal.close}
                  className={css.create_topic_modal_close}
                  onClick={onClose}
               >
                  <Image.Default src="/icons/close.svg" alt="" />
               </button>
            </header>

            <input
               type="text"
               value={title}
               maxLength={255}
               placeholder={t.forum.newTopic.titlePlaceholder}
               disabled={isSubmitting}
               className={css.create_topic_modal_input}
               onChange={(event) => setTitle(event.target.value)}
            />

            {error && <p className={css.create_topic_modal_error}>{t.forum.newTopic.error}</p>}

            <Reply
               placeholder={t.forum.newTopic.contentPlaceholder}
               buttonText={t.forum.newTopic.submit}
               // The Reply box owns the content field, so an empty title is
               // enforced here by keeping its submit button disabled.
               disabled={isSubmitting || !normalizedTitle}
               onSubmit={handleSubmit}
            />
         </div>
      </Modal>
   );
};
