"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: ReactNode;
}
export default function Portal(props: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(props.children, document.body);
}
