import React, { useEffect, useRef } from "react";
import { VisibleNode } from "../context/state";

interface ExplorerTreeProps {
  visibleNodes: VisibleNode[];
  addingChildDirId: string | null;
  registerAnchorRef: (el: HTMLDivElement | null) => void;
  renderNode: (node: VisibleNode) => React.ReactNode;
}

export default function ExplorerTree(props: ExplorerTreeProps) {
  return (
    <div className="w-full h-full">
      {props.visibleNodes.map((visibleNode) => {
        const isAddingChild = props.addingChildDirId === visibleNode.node.id;
        return (
          <div key={visibleNode.node.id} className="flex flex-col gap-1">
            {props.renderNode(visibleNode)}
            {isAddingChild && (
              <PendingAnchor
                onRegister={props.registerAnchorRef}
                depth={visibleNode.depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
function PendingAnchor({
  onRegister,
  depth,
}: {
  onRegister: (el: HTMLDivElement | null) => void;
  depth: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onRegister(ref.current);
    return () => onRegister(null); // Cleanup on unmount
  }, [onRegister]);

  return (
    <div
      ref={ref}
      style={{ paddingLeft: `${depth * 16}px` }}
      className="w-full h-8"
    />
  );
}
