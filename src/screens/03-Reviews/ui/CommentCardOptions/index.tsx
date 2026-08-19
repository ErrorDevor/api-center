"use client";

import React from "react";

import type { CommentProviderDetails } from "screens/03-Reviews/lib/comments.type";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import { formatProviderAge } from "shared/lib/i18n/formatters";
import Image from "shared/ui/base/Image";
import { StarIcon } from "shared/ui/icons";

import css from "./CommentCardOptions.module.scss";

interface Prop {
   data: CommentProviderDetails;
}

const INITIAL_COLUMN_WIDTHS: [number, number] = [50, 50];
const MIN_COLUMN_WIDTHS: [number, number] = [32, 42];

const MOBILE_VISIBLE_COUNT = 4;
const MOBILE_VISIBLE_STEP = 4;

export const CommentCardOptions: React.FC<Prop> = ({ data }) => {
   const { locale, t } = useTranslation();
   const isMobile = useIsMobile();
   const translation = t.groupBuys.providerDetails;
   const [visibleModelsCount, setVisibleModelsCount] = React.useState(MOBILE_VISIBLE_COUNT);
   const [tableColumnWidths, setTableColumnWidths] = React.useState<[number, number][]>([
      [...INITIAL_COLUMN_WIDTHS],
      [...INITIAL_COLUMN_WIDTHS],
   ]);

   const middleIndex = Math.ceil(data.models.length / 2);
   const modelColumns = [data.models.slice(0, middleIndex), data.models.slice(middleIndex)];

   const visibleMobileModels = data.models.slice(0, visibleModelsCount);
   const modelsLayout = isMobile ? [visibleMobileModels] : modelColumns;
   const hasMoreModels = isMobile && visibleModelsCount < data.models.length;

   const handleShowMoreModels = () => {
      setVisibleModelsCount((current) =>
         Math.min(current + MOBILE_VISIBLE_STEP, data.models.length)
      );
   };

   const handleResizeStart = (
      event: React.PointerEvent<HTMLButtonElement>,
      tableElement: HTMLDivElement,
      tableIndex: number
   ) => {
      event.preventDefault();
      event.stopPropagation();

      const tableWidth = tableElement.clientWidth;

      if (!tableWidth) {
         return;
      }

      const startX = event.clientX;
      const startWidths = tableColumnWidths[tableIndex];

      if (!startWidths) {
         return;
      }

      const [startModelWidth, startPriceWidth] = startWidths;
      const totalWidth = startModelWidth + startPriceWidth;

      const handlePointerMove = (pointerEvent: PointerEvent) => {
         const deltaPixels = pointerEvent.clientX - startX;
         const deltaPercent = (deltaPixels / tableWidth) * 100;

         let modelWidth = startModelWidth + deltaPercent;
         let priceWidth = startPriceWidth - deltaPercent;

         if (modelWidth < MIN_COLUMN_WIDTHS[0]) {
            modelWidth = MIN_COLUMN_WIDTHS[0];
            priceWidth = totalWidth - modelWidth;
         }

         if (priceWidth < MIN_COLUMN_WIDTHS[1]) {
            priceWidth = MIN_COLUMN_WIDTHS[1];
            modelWidth = totalWidth - priceWidth;
         }

         setTableColumnWidths((currentWidths) =>
            currentWidths.map((widths, index) =>
               index === tableIndex ? [modelWidth, priceWidth] : widths
            )
         );
      };

      const handlePointerUp = () => {
         document.body.style.cursor = "";
         document.body.style.userSelect = "";

         window.removeEventListener("pointermove", handlePointerMove);
         window.removeEventListener("pointerup", handlePointerUp);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
   };

   React.useEffect(() => {
      if (isMobile) {
         setVisibleModelsCount(MOBILE_VISIBLE_COUNT);
      }
   }, [isMobile]);

   return (
      <div className={css.comment_card_options}>
         <div className={css.comment_card_options_info}>
            <div className={css.comment_card_options_row}>
               <div className={css.comment_card_options_item}>
                  <span className={css.comment_card_options_label}>{translation.link}:</span>

                  <a
                     className={css.comment_card_options_link}
                     href={data.url}
                     target="_blank"
                     rel="noreferrer"
                  >
                     {data.url}
                  </a>
               </div>

               <div className={css.comment_card_options_item}>
                  <span className={css.comment_card_options_label}>
                     {translation.positiveRatio}:
                  </span>

                  <span className={css.comment_card_options_rating}>
                     <StarIcon className={css.comment_card_options_star} />

                     <span>{Math.round(data.positiveRatio)}%</span>
                  </span>
               </div>
            </div>

            <div className={css.comment_card_options_row}>
               {data.age && (
                  <div className={css.comment_card_options_item}>
                     <span className={css.comment_card_options_label}>{translation.age}:</span>

                     <span className={css.comment_card_options_value}>
                        {formatProviderAge(data.age, locale)}
                     </span>
                  </div>
               )}

               <div className={css.comment_card_options_item}>
                  <span className={css.comment_card_options_label}>{translation.reviews}:</span>

                  <span className={css.comment_card_options_reviews}>
                     <span className={css.comment_card_options_positive}>
                        {data.positiveCount}
                     </span>

                     <div className={css.reports}>
                        <div className={css.reports_inner}>{data.negativeCount}</div>
                     </div>
                  </span>
               </div>
            </div>

            <div className={css.comment_card_options_row}>
               <div className={css.comment_card_options_item}>
                  <span className={css.comment_card_options_label}>
                     {translation.paymentMethods}:
                  </span>

                  <span className={css.comment_card_options_value}>
                     {data.paymentMethods.join(", ")}
                  </span>
               </div>
               <button type="button" className={css.comment_card_options_more}>
                  <span>{translation.showAll}</span>

                  <span className={css.comment_card_options_arrow} />
               </button>
            </div>
         </div>

         {data.models.length > 0 && (
            <>
               <div className={css.comment_card_options_separator} />

               <div className={css.comment_card_options_models}>
                  <div className={css.comment_card_options_models_header}>
                     <h4>{translation.topModelsPrices}</h4>

                     <button type="button" className={css.comment_card_options_more}>
                        <span>{translation.showAll}</span>

                        <span className={css.comment_card_options_arrow} />
                     </button>
                  </div>

                  <div className={css.comment_card_options_tables}>
               {modelsLayout.map((models, tableIndex) => {
                  const widths = tableColumnWidths[tableIndex] ?? INITIAL_COLUMN_WIDTHS;

                  const tableStyle = {
                     "--model-column": `${widths[0]}%`,
                     "--price-column": `${widths[1]}%`,
                  } as React.CSSProperties;

                  return (
                     <div
                        key={tableIndex}
                        className={css.comment_card_options_table}
                        style={tableStyle}
                     >
                        <div className={css.comment_card_options_table_header}>
                           <div className={css.comment_card_options_table_header_cell}>
                              <span>{translation.modelName}</span>

                              <button
                                 type="button"
                                 className={css.comment_card_options_table_resize}
                                 aria-label={translation.resizeColumn}
                                 onPointerDown={(event) => {
                                    const tableElement =
                                       event.currentTarget.closest<HTMLDivElement>(
                                          `.${css.comment_card_options_table}`
                                       );

                                    if (tableElement) {
                                       handleResizeStart(event, tableElement, tableIndex);
                                    }
                                 }}
                              >
                                 <span />
                              </button>
                           </div>

                           <div className={css.comment_card_options_table_header_cell}>
                              <span>{translation.price}</span>
                           </div>
                        </div>

                        <div className={css.comment_card_options_table_body}>
                           {models.map((model) => (
                              <div key={model.id} className={css.comment_card_options_table_row}>
                                 <div className={css.comment_card_options_model}>
                                    <span className={css.comment_card_options_mobile_label}>
                                       {translation.modelName}
                                    </span>

                                    <span className={css.comment_card_options_mobile_dots} />

                                    <span className={css.comment_card_options_model_icon}>
                                       {model.icon && (
                                          <Image.Default
                                             src={model.icon}
                                             alt=""
                                             aria-hidden="true"
                                          />
                                       )}
                                    </span>

                                    <strong>{model.name}</strong>
                                 </div>

                                 <div className={css.comment_card_options_prices}>
                                    <span className={css.comment_card_options_mobile_label}>
                                       {translation.price}
                                    </span>

                                    <span className={css.comment_card_options_mobile_dots} />

                                    <div className={css.comment_card_options_prices_values}>
                                       <div className={css.comment_card_options_price}>
                                          <span>{t.common.input}:</span>

                                          <Image.Default
                                             src="/icons/energy.svg"
                                             alt=""
                                             aria-hidden="true"
                                          />

                                          <strong>
                                             ${model.inputPrice}
                                             <small>/1M</small>
                                          </strong>
                                       </div>

                                       <div className={css.comment_card_options_price}>
                                          <span>{t.common.output}:</span>

                                          <Image.Default
                                             src="/icons/energy.svg"
                                             alt=""
                                             aria-hidden="true"
                                          />

                                          <strong>
                                             ${model.outputPrice}
                                             <small>/1M</small>
                                          </strong>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  );
               })}
            </div>

            {hasMoreModels && (
               <button
                  type="button"
                  className={css.comment_card_options_show_more}
                  onClick={handleShowMoreModels}
               >
                  <span className={css.comment_card_options_show_more_arrow} />

                  <span>{t.sidebar.showMore}</span>
               </button>
            )}
               </div>
            </>
         )}
      </div>
   );
};
