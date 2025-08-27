import { useState } from "react";

import { Flex } from "@common/styled";

import { UploadFiles } from "../components/upload";
import { PdfPreview } from "../components/pdf-viewer";
import { InfoViewer } from "../components/info-viewer";
import { SearchSection } from "../components/search-section";
import { FileNavigationBar } from "../components/file-navigation-bar";

import { Button, LayoutFlex } from "./styled/components.tsx";

type Mode = "Upload" | "Review";

export const HomeLayout = () => {
  const [files, setFiles] = useState<File[]>();
  const [query, setQuery] = useState<string | string[]>("");
  const [mode, setMode] = useState<Mode>("Upload");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleChangeCurrentFile = (direction: number) => {
    if (direction === -1) {
      setCurrentFileIndex(
        direction + currentFileIndex < 0 ? 0 : direction + currentFileIndex,
      );
    } else if (files?.length) {
      setCurrentFileIndex(
        direction + currentFileIndex >= files?.length
          ? files.length - 1
          : direction + currentFileIndex,
      );
    }
  };

  const file = files && files?.length ? files[currentFileIndex] : null;

  return (
    <>
      <LayoutFlex justify="center">
        {mode === "Upload" && (
          <Flex direction="column">
            <UploadFiles onGetFiles={setFiles} />
            {file && <InfoViewer file={file} />}
            {file && (
              <Button
                onClick={() => {
                  setMode("Review");
                }}
              >
                Proceed
              </Button>
            )}
          </Flex>
        )}
        {mode === "Review" && (
          <Flex direction="column">
            <SearchSection setQuery={setQuery} />
          </Flex>
        )}

        {}

        {file && (
          <Flex direction="column" gap="4px">
            {files && files?.length > 1 && (
              <FileNavigationBar handleNavigation={handleChangeCurrentFile} />
            )}
            <PdfPreview file={file} query={query} />
          </Flex>
        )}
      </LayoutFlex>
    </>
  );
};
