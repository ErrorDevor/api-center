import React from "react";

import { groupBuys } from "../../lib/groupBuys.data";
import { GroupBuyCard } from "../GroupBuyCard";

import css from "./GroupBuysList.module.scss";

export const GroupBuysList: React.FC = () => {
   return (
      <div className={css.list}>
         {groupBuys.map((item) => (
            <GroupBuyCard key={item.id} item={item} />
         ))}
      </div>
   );
};