import React from "react";

import Image from "shared/ui/base/Image";

import css from "./DistributionSteps.module.scss";

export const SetLimitsStep: React.FC = () => {
   return (
      <div className={css.distribution_step}>
         <Image.Default
            src="/images/onboarding/distribution/set-limits.png"
            alt=""
            className={css.distribution_step_image}
         />
      </div>
   );
};