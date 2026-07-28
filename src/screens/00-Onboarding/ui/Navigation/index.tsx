import React from "react";

import { useTranslation } from "shared/lib/i18n";
import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Navigation.module.scss";

interface Props {
   onPrevious: () => void;
   onNext: () => void;
}

export const Navigation: React.FC<Props> = ({
   onPrevious,
   onNext,
}) => {
   const { t } = useTranslation();

   return (
      <div className={css.navigation}>
         <Button
            variant="grey"
            className={css.navigation_previous}
            onClick={onPrevious}
         >
            <DropdownArrowIcon />
            {t.onboarding.common.previous}
         </Button>

         <Button
            variant="black"
            className={css.navigation_next}
            onClick={onNext}
         >
            {t.onboarding.common.next}
            <DropdownArrowIcon />
         </Button>
      </div>
   );
};