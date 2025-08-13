import React from "react";
import { CreatorList } from "../creators/CreatorList";
import { newCreators, topCreators } from "../../data/creators";

export const CreatorsSection = () => (
  <div className="space-y-12">
    <section>
      <h2 className="text-xl font-typewriter text-zinc-200 mb-6">
        Top Creators
      </h2>
      <CreatorList creators={topCreators} />
    </section>

    <section>
      <h2 className="text-xl font-typewriter text-zinc-200 mb-6">
        New Creators
      </h2>
      <CreatorList creators={newCreators} />
    </section>
  </div>
);
