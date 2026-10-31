"use client";

import {
  useExplorerController,
  useExplorerState,
} from "../context/ExplorerContext";
import ConfirmDeleteModal from "../imports/ConfirmDeleteModal";

export default function ConfirmDeleteComponent() {
  const { pendingDeleteId } = useExplorerState();
  const controller = useExplorerController();
  return (
    <ConfirmDeleteModal
      visible={pendingDeleteId !== null}
      prompt={"confirm delete?"}
      onConfirm={() => controller.confirmDelete()}
      onCancel={() => controller.setDeleteId(null)}
    ></ConfirmDeleteModal>
  );
}
