"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./AddProviderScreen.module.scss";

type Status = "idle" | "sending" | "success" | "error";

export const AddProviderScreen: React.FC = () => {
   const { t } = useTranslation();
   const [status, setStatus] = React.useState<Status>("idle");

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.currentTarget;
      const formData = new FormData(form);

      setStatus("sending");

      try {
         const response = await fetch("/api/provider-requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(formData)),
         });

         if (!response.ok) {
            throw new Error(String(response.status));
         }

         form.reset();
         setStatus("success");
      } catch {
         setStatus("error");
      }
   };

   return (
      <div className={css.add_provider}>
         <h1 className={css.add_provider_title}>{t.addProvider.title}</h1>
         <p className={css.add_provider_description}>{t.addProvider.description}</p>

         <form className={css.add_provider_form} onSubmit={handleSubmit}>
            <input
               type="text"
               name="name"
               placeholder={t.addProvider.name}
               aria-label={t.addProvider.name}
               maxLength={120}
               required
            />

            <input
               type="text"
               name="website"
               placeholder={t.addProvider.website}
               aria-label={t.addProvider.website}
               maxLength={300}
               required
            />

            <input
               type="text"
               name="contact"
               placeholder={t.addProvider.contact}
               aria-label={t.addProvider.contact}
               maxLength={200}
               required
            />

            <textarea
               name="comment"
               placeholder={t.addProvider.comment}
               aria-label={t.addProvider.comment}
               maxLength={3000}
               rows={5}
            />

            {status === "success" && <p className={css.add_provider_success}>{t.addProvider.success}</p>}
            {status === "error" && <p className={css.add_provider_error}>{t.addProvider.error}</p>}

            <Button variant="blue" type="submit" disabled={status === "sending"}>
               {status === "sending" ? t.addProvider.sending : t.addProvider.submit}
            </Button>
         </form>
      </div>
   );
};
