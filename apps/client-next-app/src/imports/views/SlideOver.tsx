"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface SlideOverProps<T> {
  items: T[];
  currentIndex: number;
  onIntentIndexChanged: (index: number) => void;
  renderItem: (item: T, index: number, isFocused: boolean) => ReactNode;
}

export default function SlideOver<T>({
  items,
  currentIndex,
  onIntentIndexChanged,
  renderItem,
}: SlideOverProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🛠️ Local state solely manages instantaneous, high-performance visual animations
  const [localIndex, setLocalIndex] = useState(currentIndex);

  // 1. 🤖 PARENT SYNC: If the parent forces a change (buttons/clicks), instantly update local visuals
  useEffect(() => {
    setLocalIndex(currentIndex);

    const container = scrollContainerRef.current;
    if (!container) return;

    const targetCard = container.querySelector(
      `[data-index='${currentIndex}']`
    ) as HTMLElement;
    if (!targetCard) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cardCenter = targetCard.offsetLeft + targetCard.clientWidth / 2;

    if (Math.abs(cardCenter - containerCenter) > 5) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // 2. 🎛️ HIGH-FREQUENCY VISUAL TRACKER: Updates local styles in real-time during manual swiping
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const cards = container.querySelectorAll("[data-index]");

      cards.forEach((card) => {
        const cardLeft = (card as HTMLElement).offsetLeft;
        const cardCenter = cardLeft + (card as HTMLElement).clientWidth / 2;

        if (
          Math.abs(cardCenter - containerCenter) <
          container.clientWidth / 6
        ) {
          const index = Number(card.getAttribute("data-index"));

          // 🛠️ CRITICAL SEPARATION: Only update local state here!
          // Do NOT call the parent's handler mid-flight. This keeps the animations smooth.
          if (index !== localIndex) {
            setLocalIndex(index);
          }
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [localIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      // Once the container stops moving completely, let the parent know where we landed
      if (localIndex !== currentIndex) {
        onIntentIndexChanged(localIndex);
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [localIndex, currentIndex, onIntentIndexChanged]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full grow flex gap-6 overflow-x-auto px-[calc(50vw-16.666vw)] items-top mx-auto no-scrollbar py-3"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {items.map((item, index) => {
        // 🛠️ Scale and opacity now track local index for instant feedback
        const isFocused = index === localIndex;
        return (
          <div
            key={index}
            data-index={index}
            style={{ scrollSnapAlign: "center" }}
            className="w-[calc(100vw-16px)] md:w-[calc(66vw-32px)] min-w-[280px] h-full flex flex-col justify-start shrink-0 transition-all duration-500 ease-out transform-gpu"
          >
            <div
              className="w-full h-full transition-all duration-500 ease-out flex flex-col"
              style={{
                transform: isFocused ? "scale(1.0)" : "scale(0.96)",
                opacity: isFocused ? 1.0 : 0.4,
              }}
            >
              {renderItem(item, index, isFocused)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
