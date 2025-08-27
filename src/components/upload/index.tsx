import React, { useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DropArea } from "./DropArea";

export type MinimalDropzoneProps = {
  onFiles?: (files: File[]) => void;
  disabled?: boolean;
};

interface Props {
  onGetFiles?: (files: File[]) => void;
}

export const UploadFiles: React.FC<Props> = ({ onGetFiles }) => {
  const [files, setFiles] = React.useState<File[]>([]);

  useEffect(() => {
    onGetFiles?.(files);
  }, [files]);

  const handleFiles = useCallback((arr: File[]) => {
    setFiles(arr);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <DropArea onFiles={handleFiles} />
    </DndProvider>
  );
};
