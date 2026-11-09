"use client";

import React from "react";

import {
   PRICE_FAMILIES,
   type PriceFamilyId,
   type PriceSortKey,
   buildPriceRows,
   formatUsd,
   getModelOptions,
   isNativeRecord,
   summarize,
} from "./lib/priceRating";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";

import css from "./PriceRating.module.scss";

const parseNumber = (value: string): number | null => {
   const parsed = Number.parseFloat(value.replace(",", "."));

   return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const PriceRatingScreen: React.FC<{ className?: string }> = ({ className }) => {
   const { t } = useTranslation();
   const { records, isLoading, error } = useProviderRecords();

   const [familyId, setFamilyId] = React.useState<PriceFamilyId>("anthropic");
   const [pickedModelId, setPickedModelId] = React.useState<string | null>(null);
   const [sortKey, setSortKey] = React.useState<PriceSortKey>("input");
   const [maxInput, setMaxInput] = React.useState("");
   const [maxOutput, setMaxOutput] = React.useState("");
   const [minDiscount, setMinDiscount] = React.useState("");

   const modelOptions = React.useMemo(() => getModelOptions(records, familyId), [records, familyId]);
   const modelId = modelOptions.some((m) => m.id === pickedModelId)
      ? pickedModelId
      : (modelOptions[0]?.id ?? null);

   const allRows = React.useMemo(
      () =>
         modelId
            ? buildPriceRows(
                 records,
                 modelId,
                 { maxInput: null, maxOutput: null, minDiscount: null },
                 sortKey
              )
            : [],
      [records, modelId, sortKey]
   );
   const rows = React.useMemo(
      () =>
         modelId
            ? buildPriceRows(
                 records,
                 modelId,
                 {
                    maxInput: parseNumber(maxInput),
                    maxOutput: parseNumber(maxOutput),
                    minDiscount: parseNumber(minDiscount),
                 },
                 sortKey
              )
            : [],
      [records, modelId, sortKey, maxInput, maxOutput, minDiscount]
   );

   const summary = React.useMemo(() => summarize(allRows), [allRows]);
   const isNative = allRows.length > 0 && isNativeRecord(allRows[0].record);
   const unit = allRows[0]?.record.nativePriceUnit ?? "";
   const hasFilters = maxInput !== "" || maxOutput !== "" || minDiscount !== "";

   const resetFilters = () => {
      setMaxInput("");
      setMaxOutput("");
      setMinDiscount("");
   };

   const discountCell = (discount: number | null) =>
      discount === null ? "—" : `-${Math.round(discount)}%`;

   return (
      <div className={clsx(css.price_rating, className)}>
         <div className={css.wrapper}>
            <h3 className={css.title}>{t.priceRating.title}</h3>
            <p className={css.subtitle}>{t.priceRating.subtitle}</p>

            <div className={css.chips} role="tablist">
               {PRICE_FAMILIES.map((family) => (
                  <button
                     key={family.id}
                     type="button"
                     role="tab"
                     aria-selected={family.id === familyId}
                     className={clsx(css.chip, family.id === familyId && css.chip_active)}
                     onClick={() => {
                        setFamilyId(family.id);
                        setPickedModelId(null);
                     }}
                  >
                     {family.label}
                  </button>
               ))}
            </div>

            <div className={css.controls}>
               <label className={css.field}>
                  <span>{t.priceRating.model}</span>
                  <select
                     value={modelId ?? ""}
                     onChange={(event) => setPickedModelId(event.target.value)}
                     disabled={modelOptions.length === 0}
                  >
                     {modelOptions.map((model) => (
                        <option key={model.id} value={model.id}>
                           {model.name} ({model.providersCount})
                        </option>
                     ))}
                  </select>
               </label>

               <label className={css.field}>
                  <span>{isNative ? t.priceRating.maxPrice : t.priceRating.maxInput}</span>
                  <input
                     inputMode="decimal"
                     placeholder="$"
                     value={maxInput}
                     onChange={(event) => setMaxInput(event.target.value)}
                  />
               </label>

               {!isNative && (
                  <label className={css.field}>
                     <span>{t.priceRating.maxOutput}</span>
                     <input
                        inputMode="decimal"
                        placeholder="$"
                        value={maxOutput}
                        onChange={(event) => setMaxOutput(event.target.value)}
                     />
                  </label>
               )}

               <label className={css.field}>
                  <span>{t.priceRating.minDiscount}</span>
                  <input
                     inputMode="decimal"
                     placeholder="%"
                     value={minDiscount}
                     onChange={(event) => setMinDiscount(event.target.value)}
                  />
               </label>

               <label className={css.field}>
                  <span>{t.common.sort}</span>
                  <select
                     value={sortKey}
                     onChange={(event) => setSortKey(event.target.value as PriceSortKey)}
                  >
                     <option value="input">
                        {isNative ? t.priceRating.sortPrice : t.priceRating.sortInput}
                     </option>
                     {!isNative && <option value="output">{t.priceRating.sortOutput}</option>}
                     <option value="discount">{t.priceRating.sortDiscount}</option>
                  </select>
               </label>

               {hasFilters && (
                  <button type="button" className={css.reset} onClick={resetFilters}>
                     {t.aiProviders.filters.reset}
                  </button>
               )}
            </div>

            {summary.officialInput !== null && (
               <div className={css.summary}>
                  <div>
                     <span>{t.priceRating.official}</span>
                     <b>
                        {formatUsd(summary.officialInput)}
                        {summary.officialOutput !== null && ` / ${formatUsd(summary.officialOutput)}`}
                        {isNative && unit && ` / ${unit}`}
                     </b>
                  </div>
                  {summary.cheapestInput !== null && (
                     <div>
                        <span>{t.priceRating.cheapest}</span>
                        <b>{formatUsd(summary.cheapestInput)}</b>
                     </div>
                  )}
                  {summary.avgDiscount !== null && summary.maxDiscount !== null && (
                     <div>
                        <span>{t.priceRating.avgDiscount}</span>
                        <b>
                           -{Math.round(summary.avgDiscount)}% ({t.priceRating.upTo} -
                           {Math.round(summary.maxDiscount)}%)
                        </b>
                     </div>
                  )}
               </div>
            )}

            {error ? (
               <p className={css.empty}>{t.priceRating.loadError}</p>
            ) : isLoading ? (
               <p className={css.empty}>{t.priceRating.loading}</p>
            ) : rows.length === 0 ? (
               <p className={css.empty}>{t.priceRating.empty}</p>
            ) : (
               <div className={css.table_scroll}>
                  <table className={css.table}>
                     <thead>
                        <tr>
                           <th>#</th>
                           <th>{t.common.provider}</th>
                           <th>{isNative ? t.priceRating.price : t.priceRating.inputPer1m}</th>
                           {!isNative && <th>{t.priceRating.outputPer1m}</th>}
                           <th>{t.priceRating.discount}</th>
                           <th>{t.aiProviders.paymentMethod}</th>
                        </tr>
                     </thead>
                     <tbody>
                        {rows.map((row) => (
                           <tr key={row.record.providerDomain}>
                              <td>{row.rank}</td>
                              <td>
                                 <a
                                    href={row.record.providerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                 >
                                    {row.record.providerName}
                                 </a>
                              </td>
                              <td>
                                 {formatUsd(row.input)}
                                 {isNative && unit && <small> / {unit}</small>}
                                 {row.officialInput !== null && (
                                    <small className={css.official}>
                                       {formatUsd(row.officialInput)}
                                    </small>
                                 )}
                              </td>
                              {!isNative && (
                                 <td>
                                    {row.output !== null ? formatUsd(row.output) : "—"}
                                    {row.officialOutput !== null && (
                                       <small className={css.official}>
                                          {formatUsd(row.officialOutput)}
                                       </small>
                                    )}
                                 </td>
                              )}
                              <td className={css.discount}>
                                 {discountCell(row.inputDiscount)}
                                 {!isNative && row.outputDiscount !== row.inputDiscount && (
                                    <small> / {discountCell(row.outputDiscount)}</small>
                                 )}
                              </td>
                              <td>{row.record.paymentMethods.join(", ") || "—"}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
   );
};
