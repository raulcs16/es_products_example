import React from "react";

interface HoverCardProps {
  // 1. Tell TypeScript this component accepts other components inside it
  children: React.ReactNode;
  className?: string;
  index: number;
  onClicked?: (index: number) => void;
}

export default function HoverCard(props: HoverCardProps) {
  return (
    <div
      className={`
        transition-all 
        duration-300 
        ease-out 
        hover:scale-[1.01]
        hover:shadow-xl
        w-full
        overflow-hidden
        flex flex-col min-h-0
        ${props.className}
      `}
      onClick={() => {
        if (props.onClicked) props.onClicked(props.index);
      }}
    >
      {props.children}
    </div>
  );
}
