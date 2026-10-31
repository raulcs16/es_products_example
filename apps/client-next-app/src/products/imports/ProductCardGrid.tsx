"use client";

import { ProductCardDocument } from "@repo/product/sku/types";

export interface ProductCardGridProps {
  productCards: ProductCardDocument[];
  onCardSelected(id: string): void;
}
export default function ProductCardGrid(props: ProductCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full bg-bg-dark p-4">
      {props.productCards.map((card) => (
        <div
          key={card.id}
          onClick={() => props.onCardSelected(card.id)}
          className="h-100 flex flex-col justify-between p-4 bg-bg-light border border-slate-800/80 hover:border-slate-700 hover:bg-bg rounded-lg transition-all group cursor-pointer"
        >
          <div>
            {/* Thumbnail Image Container */}
            <div className="w-full h-40 bg-bg-dark rounded mb-3 overflow-hidden flex items-center justify-center border border-slate-800/50 group-hover:border-slate-700/60 transition-colors">
              {card.images.length > 0 && (
                <img
                  src={card.images[0].imageUrl}
                  alt={card.name}
                  className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>

            {/* SKU & Title */}
            <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider uppercase">
              {card.sku}
            </span>
            <h3 className="text-sm font-medium text-primary mt-1 line-clamp-1 group-hover:text-white transition-colors">
              {card.name}
            </h3>

            {/* Short Description */}
            {card.shortDesc && (
              <p className="text-xs text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                {card.shortDesc}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-secondary group-hover:text-slate-400">
            <span>View Details</span>
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
