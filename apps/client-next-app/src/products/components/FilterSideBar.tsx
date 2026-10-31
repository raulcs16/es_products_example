"use client";

import {
  useProductController,
  useProductStore,
} from "../context/ProductContext";

import SpecProtocolFilter from "../imports/SpecFilter";

export default function FilterSideBarComponent() {
  const store = useProductStore();
  const controller = useProductController();
  const { selectedCerts, selectedShafts, selectedWeights, selectedFrames } =
    store.activeFilters;
  return (
    <div className="w-full h-full px-6 bg-bg-light space-y-5 overflow-y-auto pb-10">
      <h2 className="sticky top-0 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-bg-light w-full py-2">
        Technical Filters
      </h2>
      <div className="flex flex-col gap-6 text-xs text-slate-500">
        <SpecProtocolFilter
          spec="Certifications"
          keys={store.certifications}
          selectedKeys={selectedCerts}
          onToggleKey={controller.toggleCert}
          onClear={controller.clearSelectedCerts}
        ></SpecProtocolFilter>
        <SpecProtocolFilter
          spec="Weights"
          keys={store.weights}
          selectedKeys={selectedWeights}
          onToggleKey={controller.toggleWeight}
          onClear={controller.clearSelectedWeights}
        ></SpecProtocolFilter>
        <SpecProtocolFilter
          spec="Frame Size"
          keys={store.frames}
          selectedKeys={selectedFrames}
          onToggleKey={controller.toggleFrame}
          onClear={controller.clearSelectedFrames}
        ></SpecProtocolFilter>
        <SpecProtocolFilter
          spec="Shaft Diameter"
          keys={store.shafts}
          selectedKeys={selectedShafts}
          onToggleKey={controller.toggleShaft}
          onClear={controller.clearSelectedShafts}
        ></SpecProtocolFilter>
      </div>
    </div>
  );
}
