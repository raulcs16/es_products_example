import {
  EXPLORER_TYPES,
  ExplorerContextMenu,
  ExplorerInputMode,
  ExplorerState,
  InputMode,
  MenuMode,
  VisibleNode,
} from "./state";
import { IStateStore } from "@/src/utils/istate_store";

export interface IExplorerDataDelegate {
  createDirectory(title: string, parentId: string | null): void;
  createFile(title: string, parentId: string): void;
  renameFile(id: string, newName: string): void;
  renameDirectory(id: string, newName: string): void;
  deleteFile(id: string): void;
  onDirectorySelected(id: string): void;
  onFileSelected(id: string, parentId: string | null): void;
}

export default class ExplorerController {
  constructor(
    private delegate: IExplorerDataDelegate,
    private store: IStateStore<ExplorerState>
  ) {}
  public toggleOpenState(): void {
    this.store.setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }
  public setInputMode(mode: ExplorerInputMode) {
    this.store.setState((prev) => ({
      ...prev,
      inputMode: mode,
      editId:
        mode.mode === InputMode.RenameDirectory ||
        mode.mode === InputMode.RenameFile
          ? mode.parentId
          : null,
    }));
  }

  public setInputTarget(el: HTMLElement | null): void {
    const inputMode = this.store.getState().inputMode;
    if (inputMode.mode === InputMode.Hidden) return;
    if (inputMode.anchorRef?.current === el) {
      return;
    }
    this.store.setState((prev) => ({
      ...prev,
      inputMode: {
        ...prev.inputMode,
        anchorRef: { current: el },
      },
    }));
  }
  public handleTextInput(text: string): void {
    const inp = this.store.getState().inputMode;
    switch (inp.mode) {
      case InputMode.AddDirectoryNode:
        this.delegate.createDirectory(text, null);
        break;
      case InputMode.AddFileNode:
        this.delegate.createFile(text, inp.parentId!);
        this.store.setState((prev) => {
          const nextExpanded = new Set(prev.expandedNodeIds);
          nextExpanded.add(inp.parentId!);
          return { ...prev, expandedNodeIds: nextExpanded };
        });
        break;
      case InputMode.RenameFile:
        this.delegate.renameFile(inp.parentId!, text);
        break;
      case InputMode.RenameDirectory:
        this.delegate.renameDirectory(inp.parentId!, text);
        break;
      default:
        break;
    }
    this.hideTextInput();
  }
  public hideTextInput(): void {
    const nullMode: ExplorerInputMode = {
      mode: InputMode.Hidden,
      anchorRef: null,
      parentId: null,
      placeHolder: "",
    };
    this.store.setState((prev) => ({
      ...prev,
      inputMode: nullMode,
      editId: null,
    }));
  }
  public setDeleteId(id: string | null): void {
    this.store.setState((prev) => ({
      ...prev,
      pendingDeleteId: id,
    }));
  }
  public confirmDelete(): void {
    const id = this.store.getState().pendingDeleteId;
    if (id === null) return;
    this.delegate.deleteFile(id);
    this.setDeleteId(null);
  }
  public setContextMenu(context: ExplorerContextMenu): void {
    this.store.setState((prev) => ({
      ...prev,
      contextMenu: context,
    }));
  }
  public hideContextMenu(): void {
    const context: ExplorerContextMenu = {
      mode: MenuMode.Hidden,
      x: 0,
      y: 0,
      targetId: "",
      anchorRef: null,
    };
    this.store.setState((prev) => ({
      ...prev,
      contextMenu: context,
    }));
  }
  public onNodeSelected(vnode: VisibleNode): void {
    const node = vnode.node;
    this.store.setState((prev) => {
      // 1. Immutable copy of the expansion Set
      const nextExpanded = new Set(prev.expandedNodeIds);

      // 2. Container logic: toggle expanded state regardless of whether it currently has children
      if (node.type === EXPLORER_TYPES.CONTAINER) {
        if (nextExpanded.has(node.id)) {
          nextExpanded.delete(node.id);
        } else {
          nextExpanded.add(node.id);
        }
      }

      // 3. Return a clean, new state object
      return {
        ...prev,
        selectedId: node.id,
        expandedNodeIds: nextExpanded,
      };
    });
    if (node.type === EXPLORER_TYPES.CONTAINER) {
      this.delegate.onDirectorySelected(node.id);
    } else {
      this.delegate.onFileSelected(node.id, node.parentId);
    }
  }
}
