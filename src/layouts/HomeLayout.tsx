import { useState } from "react";

import { Flex } from "@common/styled";

import { UploadFiles } from "../components/upload";
import { PdfPreview } from "../components/pdf-viewer";
import { InfoViewer } from "../components/info-viewer";
import { SearchSection } from "../components/search-section";

import { Button, LayoutFlex } from "./styled/components.tsx";

type Mode = "Upload" | "Review";

export const HomeLayout = () => {
  const [files, setFiles] = useState<File[]>();
  const [query, setQuery] = useState<string | string[]>("");
  const [mode, setMode] = useState<Mode>("Upload");

  const file = files && files?.length ? files[0] : null;

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

        {file && <PdfPreview file={file} query={query} />}
      </LayoutFlex>
    </>
  );
};
