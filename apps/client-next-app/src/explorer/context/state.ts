import { AnchorLocation } from "@/src/imports/hooks/anchor_location";
import { RefObject } from "react";

export enum InputMode {
  AddDirectoryNode,
  AddFileNode,
  RenameDirectory,
  RenameFile,
  Hidden,
}
export enum MenuMode {
  Explorer,
  Directory,
  File,
  Hidden,
}

export type ExplorerInputMode = {
  mode: InputMode;
  placeHolder: string;
  anchorRef: RefObject<HTMLElement | null> | null;
  parentId: string | null;
};
export type ExplorerContextMenu = {
  mode: MenuMode;
  targetId: string;
  anchorRef: RefObject<HTMLElement | null> | null;
  x: number;
  y: number;
};
export const EXPLORER_TYPES = {
  CONTAINER: "containers",
  ITEM: "items",
};
export type ExplorerType = (typeof EXPLORER_TYPES)[keyof typeof EXPLORER_TYPES];

export type ExplorerNode = {
  id: string;
  label: string;
  parentId: string | null;
  type: ExplorerType;
};

export type VisibleNode = {
  node: ExplorerNode;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
};

export type ExplorerState = {
  isOpen: boolean;
  editId: string | null;
  selectedId: string | null;
  pendingDeleteId: string | null;
  inputMode: ExplorerInputMode;
  contextMenu: ExplorerContextMenu;
  expandedNodeIds: Set<string>;
};
