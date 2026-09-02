import React from "react";

import type { TopicItem } from "../../lib/types";

import { TopicCard } from "../TopicCard";

import css from "./TopicsList.module.scss";

interface Prop {
   topics: TopicItem[];
   onTopicClick?: (id: number) => void;
}

export const TopicsList: React.FC<Prop> = ({ topics, onTopicClick }) => {
   return (
      <div className={css.topics_list}>
         {topics.map((topic) => (
            <TopicCard key={topic.id} data={topic} onClick={onTopicClick} />
         ))}
      </div>
   );
};
