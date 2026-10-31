"use client";

import { CSSProperties, useEffect, useState } from "react";
import { AnchorLocation } from "./anchor_location";

export function usePosCoords(
  x: number = 0,
  y: number = 0,
  anchor: AnchorLocation = AnchorLocation.Cover
) {
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const updatePosition = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      switch (anchor) {
        case AnchorLocation.BottomRight:
          setStyle({
            top: `${y}px`,
            left: `${x}px`,
          });
          break;
        case AnchorLocation.BottomLeft:
          setStyle({
            top: `${y}px`,
            right: `${vw - x}px`,
          });
          break;

        case AnchorLocation.TopRight:
          setStyle({
            bottom: `${vh - y}px`,
            left: `${x}px`,
          });
          break;

        case AnchorLocation.TopLeft:
          setStyle({
            bottom: `${vh - y}px`,
            right: `${vw - x}px`,
          });
          break;

        case AnchorLocation.Cover:
        default:
          setStyle({
            top: `${y}px`,
            left: `${x}px`,
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
  }, [x, y, anchor]);

  return style;
}
