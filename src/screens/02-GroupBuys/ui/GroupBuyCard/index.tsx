"use client";

import React from "react";

import { useRouter } from "next/navigation";

import type { GroupBuyItem } from "../../lib/groupBuys.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { formatRelativeDate } from "shared/lib/i18n/formatters";
import { useProviderPopularity } from "shared/lib/providers/popularity/useProviderPopularity";
import { UserInfo } from "shared/ui/components/UserInfo";
import { ClockIcon, MessageTextIcon } from "shared/ui/icons";

import css from "./GroupBuyCard.module.scss";

interface Props {
   item: GroupBuyItem;
   withBackground?: boolean;
}

const SEATS_SEGMENTS_COUNT = 19;
const SEATS_SEGMENTS_COUNT_MOBILE = 4;

export const GroupBuyCard: React.FC<Props> = ({ item, withBackground = true }) => {
   const { locale, t } = useTranslation();
   const router = useRouter();
   const { trackClick } = useProviderPopularity();
   const translation = t.groupBuys.items[item.translationKey];

   // Opening a bundle or its reviews counts as a click for every vendor the
   // bundle unlocks — that's what the /group-buys "popular" sort ranks on.
   const trackBundleClick = () => {
      item.vendorIds.forEach((vendorId) => {
         void trackClick(vendorId);
      });
   };
   const peopleLabel = t.groupBuys.forPeople.replace("{count}", String(item.totalPersons));

   const seatsTakenLabel = t.groupBuys.seatsTaken
      .replace("{taken}", String(item.takenPersons))
      .replace("{total}", String(item.totalPersons));

   const activeSegmentsCount =
      item.takenPersons === 0
         ? 0
         : Math.max(1, Math.floor((item.takenPersons / item.totalPersons) * SEATS_SEGMENTS_COUNT));

         const activeSegmentsCountMob =
      item.takenPersons === 0
         ? 0
         : Math.max(1, Math.floor((item.takenPersons / item.totalPersons) * SEATS_SEGMENTS_COUNT_MOBILE));

   return (
      <article className={clsx(css.card, withBackground && css.card_background)}>
         <div className={css.card_header}>
            <UserInfo userName={item.userName} userAvatar={item.userAvatar} withName={true} />

            <span className={css.card_status}>
               <div className={css.card_status_inner}>{peopleLabel}</div>
            </span>
         </div>

         <div className={css.card_content}>
            <div className={css.card_main}>
               <h3
                  className={css.card_title}
                  onClick={() => {
                     trackBundleClick();
                     router.push("/buys");
                  }}
               >
                  {translation.title}
               </h3>

               <div className={css.card_description}>
                  <span className={css.card_description_mark} />

                  <p>{translation.description}</p>
               </div>
            </div>

            <div className={css.card_seats_mobile}>
               <div className={css.card_seats} aria-label={seatsTakenLabel}>
                  {Array.from({
                     length: SEATS_SEGMENTS_COUNT_MOBILE,
                  }).map((_, index) => (
                     <span
                        key={index}
                        className={clsx(
                           css.card_seat,
                           index < activeSegmentsCountMob && css.card_seat_active
                        )}
                     />
                  ))}
               </div>
               <span className={css.card_taken}>{seatsTakenLabel}</span>
            </div>

            <div className={css.card_info}>
               <div className={css.card_info_row}>
                  <div className={css.card_info_left}>
                     <div className={css.card_info_left_seats}>
                        <div className={css.card_seats} aria-label={seatsTakenLabel}>
                           {Array.from({
                              length: SEATS_SEGMENTS_COUNT,
                           }).map((_, index) => (
                              <span
                                 key={index}
                                 className={clsx(
                                    css.card_seat,
                                    index < activeSegmentsCount && css.card_seat_active
                                 )}
                              />
                           ))}
                        </div>

                        <span className={css.card_taken}>{seatsTakenLabel}</span>
                        <span className={css.card_dot} />
                     </div>

                     <div className={css.card_price_block}>
                        <strong className={css.card_price}>${item.price}</strong>

                        <span>{t.groupBuys.forOnePerson}</span>
                     </div>

                     <span className={css.card_dot} />

                     <div className={css.card_meta}>
                        <ClockIcon />

                        <span>{formatRelativeDate(item.publishedAt, locale)}</span>
                     </div>

                     <span className={css.card_dot} />

                     <button
                        className={css.card_meta}
                        type="button"
                        onClick={() => {
                           trackBundleClick();
                           router.push("/reviews");
                        }}
                     >
                        <MessageTextIcon />

                        <span>{item.comments}</span>
                     </button>
                  </div>
                  <span className={clsx(css.card_dot, css.mob_dot)} />
                  <span className={css.card_payment}>{item.paymentMethod}</span>
               </div>
            </div>
         </div>
      </article>
   );
};
