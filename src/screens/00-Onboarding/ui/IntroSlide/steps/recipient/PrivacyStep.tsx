import React from "react";

import Image from "shared/ui/base/Image";

import css from "./RecipientSteps.module.scss";

export const PrivacyStep: React.FC = () => {
   return (
      <div className={css.recipient_step}>
         <Image.Default
            src="/images/onboarding/recipient/privacy-step.png"
            alt=""
            className={css.recipient_step_image}
         />
      </div>
   );
};
