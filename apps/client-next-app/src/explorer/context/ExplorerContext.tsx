"use client";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  ExplorerNode,
  ExplorerState,
  InputMode,
  MenuMode,
  VisibleNode,
} from "./state";
import ExplorerController, { IExplorerDataDelegate } from "./controller";
import { IStateStore } from "@/src/utils/istate_store";

const ExplorerContext = createContext<{
  visibleNodes: VisibleNode[];
  state: ExplorerState;
  controller: ExplorerController;
} | null>(null);

interface ExplorerContextProps {
  children: React.ReactNode;
  nodes: ExplorerNode[];
  delegate: IExplorerDataDelegate;
}

export function ExplorerContextProvider(props: ExplorerContextProps) {
  const [explorerState, setExplorerState] = useState<ExplorerState>({
    expandedNodeIds: new Set<string>(),
    isOpen: false,
    editId: null,
    selectedId: null,
    pendingDeleteId: null,
    inputMode: {
      mode: InputMode.Hidden,
      anchorRef: null,
      parentId: null,
      placeHolder: "",
    },
    contextMenu: {
      mode: MenuMode.Hidden,
      anchorRef: null,
      x: 0,
      y: 0,
      targetId: "",
    },
  });

  // 1. Keep a ref that always points to the latest state
  const stateRef = useRef(explorerState);
  stateRef.current = explorerState;

  const appControllerRef = useRef<ExplorerController | null>(null);

  if (!appControllerRef.current) {
    // 2. Pass a dynamic getState that reads from stateRef.current
    const store: IStateStore<ExplorerState> = {
      getState: () => stateRef.current,
      setState: setExplorerState,
    };
    appControllerRef.current = new ExplorerController(props.delegate, store);
  }

  const controller = appControllerRef.current;

  const visibleNodes = useMemo(() => {
    const visibleList = flattenVisibleTree(
      props.nodes,
      explorerState.expandedNodeIds
    );
    return visibleList;
  }, [props.nodes, explorerState.expandedNodeIds]);

  return (
    <ExplorerContext.Provider
      value={{ visibleNodes, state: explorerState, controller }}
    >
      {props.children}
    </ExplorerContext.Provider>
  );
}
export function useVisibleNodes(): VisibleNode[] {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error("Explorer Context Missing");
  return context.visibleNodes;
}

export function useExplorerState(): ExplorerState {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error("Explorer Context Missing");
  return context.state;
}
export function useExplorerController(): ExplorerController {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error("Explorer Context Missing");
  return context.controller;
}

export function createTreeIndex(nodes: ExplorerNode[]) {
  const childrenMap = new Map<string | null, ExplorerNode[]>();
  nodes.forEach((node) => {
    const parentId = node.parentId ?? null;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(node);
  });
  return childrenMap;
}

export function flattenVisibleTree(
  nodes: ExplorerNode[],
  expandedNodeIds: Set<string>
): VisibleNode[] {
  const childrenMap = createTreeIndex(nodes);
  const visibleList: VisibleNode[] = [];

  function walk(parentId: string | null, depth: number) {
    const childNodes = childrenMap.get(parentId);
    if (!childNodes || childNodes.length === 0) return;
    for (const node of childNodes) {
      const nodeChildren = childrenMap.get(node.id);
      const hasChildren = Boolean(nodeChildren && nodeChildren.length > 0);
      const isExpanded = expandedNodeIds.has(node.id);
      visibleList.push({
        node,
        depth,
        hasChildren,
        isExpanded,
      });
      if (hasChildren && isExpanded) {
        walk(node.id, depth + 1);
      }
    }
  }
  walk(null, 0);
  return visibleList;
}
