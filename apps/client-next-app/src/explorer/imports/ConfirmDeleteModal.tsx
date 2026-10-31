"use client";

import CenterScreenCard from "@/src/imports/cards/CenteredScreenCard";
import Button from "@/src/imports/controls/Button";
import Modal from "@/src/imports/controls/Modal";

export interface ConfirmDeleteModalProps {
  visible: boolean;
  prompt: string;
  onConfirm(): void;
  onCancel(): void;
}
export default function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  return (
    <Modal z={80} open={props.visible}>
      <CenterScreenCard>
        <div className="flex items-center flex-col gap-4 ">
          <p>{props.prompt}</p>
          <div className="flex gap-4">
            <Button active={true} title="Confirm" onClick={props.onConfirm}>
              <p className="w-[5ch]">Yes</p>
            </Button>
            <Button active={true} title="Cancel" onClick={props.onCancel}>
              <p className="w-[5ch]">No</p>
            </Button>
          </div>
        </div>
      </CenterScreenCard>
    </Modal>
  );
}
