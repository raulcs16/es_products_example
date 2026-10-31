"use client";

import { CSSProperties, RefObject, useEffect, useState } from "react";
import { AnchorLocation } from "./anchor_location";

export function useRectCoords(
  elementRef?: RefObject<HTMLElement | null> | null,
  anchor: AnchorLocation = AnchorLocation.Cover
) {
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!elementRef || !elementRef.current) {
      setStyle({});
      return;
    }

    const updatePosition = () => {
      if (!elementRef.current) return;

      const box = elementRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      switch (anchor) {
        case AnchorLocation.BottomRight:
          // Fixed relative to bottom-right corner of the target element
          setStyle({
            top: `${box.bottom}px`,
            left: `${box.right}px`,
          });
          break;

        case AnchorLocation.BottomLeft:
          // Fixed relative to bottom-left corner of target element
          setStyle({
            top: `${box.bottom}px`,
            right: `${vw - box.left}px`,
          });
          break;

        case AnchorLocation.TopRight:
          // Fixed relative to top-right corner of target element
          setStyle({
            bottom: `${vh - box.top}px`,
            left: `${box.right}px`,
          });
          break;

        case AnchorLocation.TopLeft:
          // Fixed relative to top-left corner of target element
          setStyle({
            bottom: `${vh - box.top}px`,
            right: `${vw - box.left}px`,
          });
          break;

        case AnchorLocation.Cover:
        default:
          // Covers exact width and height of the target element
          setStyle({
            top: `${box.top}px`,
            left: `${box.left}px`,
          });
          break;
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [elementRef, anchor]);

  return style;
}
export { AnchorLocation };

