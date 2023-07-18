"use client";
import { Modal } from "flowbite-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { VaultItem } from "@/server/entities/VaultItem";
import { Button } from "./Button";

interface DeleteModalProps {
  openModal: string | undefined;
  setOpenModal: Dispatch<SetStateAction<string | undefined>>;
  item?: VaultItem;
  onSubmit: () => any;
  onClose?: () => any;
}

export const DeleteModal = ({
  openModal,
  setOpenModal,
  item,
  onSubmit,
  onClose,
}: DeleteModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [confirm, setConfirm] = useState("");

  const confirmRef = useRef<HTMLInputElement>(null);

  const clearForm = useCallback(() => {
    setConfirm("");
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      if (item && confirm === "DELETE") {
        const userCredentials = localStorage.getItem("fv_uc");
        await axios.delete(`/api/v1/vault-item/${item.id}`, {
          headers: { Authorization: `Basic ${userCredentials}` },
        });
        setOpenModal(undefined);
        onSubmit();
        clearForm();
        if (onClose) onClose();
      }
    } catch (err) {
      // todo
    }
  }, [clearForm, confirm, item, onClose, onSubmit, setOpenModal]);

  useEffect(() => {
    if (openModal && confirmRef) confirmRef.current?.focus();
  }, [openModal]);

  return (
    <div ref={rootRef}>
      <Modal
        root={rootRef.current ?? undefined}
        size="lg"
        show={openModal === "default"}
        onClose={() => {
          setOpenModal(undefined);
          clearForm();
          if (onClose) onClose();
        }}
      >
        <Modal.Header className="bg-slate-700 border-none">
          <span className="text-zinc-100">Delete Item</span>
        </Modal.Header>
        <Modal.Body className="bg-zinc-900 border-b-zinc-700 flex flex-col gap-3">
          <p>
            Are you sure you want to delete item {item?.name}? To confirm, type{" "}
            <span className="font-bold">DELETE</span>:
          </p>
          <input
            ref={confirmRef}
            type="text"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder=""
            className="p-2 bg-zinc-800 border-zinc-800 border-2 rounded-md focus:border-blue-500"
          />
        </Modal.Body>
        <Modal.Footer className="bg-zinc-900 flex justify-end gap-3 border-t-zinc-700">
          <Button
            value="Cancel"
            variant="outline"
            onClick={() => {
              setOpenModal(undefined);
              clearForm();
              if (onClose) onClose();
            }}
          />
          <Button value="Delete" onClick={handleDelete} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};
