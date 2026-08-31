"use client";

import React from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { ArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./FeatureTestingModal.module.scss";

interface Prop {
   className?: string;
}

const highlightPro = (text: string) => {
   return text.split(/(PRO)/gi).map((part, index) =>
      part.toUpperCase() === "PRO" ? (
         <span key={index} className={css.pro}>
            {part}
         </span>
      ) : (
         part
      )
   );
};

export const FeatureTestingModal: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();
   const router = useRouter();

   const handleBack = () => {
      router.push("/");
   };

   return (
      <div className={clsx(css.feature_testing_modal, className)}>
         <Image.Default
            src="/images/feature-in-testing.png"
            className={css.feature_testing_modal_image}
         />
         <div className={css.feature_testing_modal_text}>
            <h5>{t.featureTestingModal.title}</h5>
            <p>{highlightPro(t.featureTestingModal.text)}</p>
         </div>

         <Button variant="grey" className={css.button_back} onClick={handleBack}>
            <ArrowIcon />
            {t.common.buttonBack}
         </Button>
      </div>
   );
};
