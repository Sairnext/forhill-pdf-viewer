import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { Flex } from "@common/styled";
import { FileText } from "lucide-react";
import type { MinimalDropzoneProps } from "./index.tsx";

const ALLOWED_MIME = new Set(["application/pdf"]);

export const DropArea = ({ onFiles, disabled }: MinimalDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    (filesLike: FileList | File[]) => {
      if (!onFiles) return;
      const files = Array.from(filesLike || []);
      // keep only PDFs, then choose ONE (last wins if multiple provided)
      const accepted = files.filter((f) => ALLOWED_MIME.has(f.type));
      const chosen = accepted.at(-1); // use .at(0) if you prefer "first wins"
      if (chosen) onFiles([chosen]); // always send a single file
    },
    [onFiles],
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      canDrop: () => !disabled,
      drop: (item: { files?: FileList }) => {
        if (disabled) return;
        handleFiles(item.files || []);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFiles, disabled],
  );

  const attachDrop: React.RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      if (node) drop(node);
    },
    [drop],
  );

  const onClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    if (e.target.files?.length) {
      handleFiles(e.target.files); // will pick just one
      e.target.value = ""; // allow re-selecting the same file
    }
  };

  const style: React.CSSProperties = {
    border: "2px dashed #9ca3af",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    background: isOver && canDrop ? "#eff6ff" : "transparent",
    color: "#111827",
    minWidth: "450px",
    height: "fit-content",
    outline: "none",
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        // ⬇️ no 'multiple' — picker enforces single selection
        onChange={onInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
        disabled={disabled}
      />

      <Flex
        align="center"
        direction="column"
        style={style}
        aria-disabled={disabled}
        aria-label="Upload a contract document (drag & drop or click to select)"
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        ref={attachDrop}
      >
        <Flex gap="8">
          <strong>Upload a Contract Document</strong>
          <FileText size={20} />
        </Flex>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
          Accepted: PDF
        </div>
      </Flex>
    </>
  );
};
