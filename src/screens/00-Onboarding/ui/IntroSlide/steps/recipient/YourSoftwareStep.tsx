import React from "react";

import Image from "shared/ui/base/Image";

import css from "./RecipientSteps.module.scss";

export const YourSoftwareStep: React.FC = () => {
   return (
      <div className={css.recipient_step}>
         <Image.Default
            src="/images/onboarding/recipient/your-software-step.png"
            alt=""
            className={css.recipient_step_image}
         />
      </div>
   );
};
