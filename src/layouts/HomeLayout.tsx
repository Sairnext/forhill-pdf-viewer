import { useState } from "react";

import { Flex } from "@common/styled";

import { UploadFiles } from "../components/upload";
import { PdfPreview } from "../components/pdf-viewer";
import { InfoViewer } from "../components/info-viewer";
import { SearchSection } from "../components/search-section";

import { Button, LayoutFlex } from "./styled/components.tsx";

enum Mode {
  Upload,
  Review,
}

export const HomeLayout = () => {
  const [files, setFiles] = useState<File[]>();
  const [query, setQuery] = useState<string | string[]>("");
  const [mode, setMode] = useState<Mode>(Mode.Upload);

  const file = files && files?.length ? files[0] : null;

  console.log("query :: ", query);

  return (
    <>
      <LayoutFlex justify="center">
        {mode === Mode.Upload && (
          <Flex direction="column">
            <UploadFiles onGetFiles={setFiles} />
            {file && <InfoViewer file={file} />}
            {file && (
              <Button
                onClick={() => {
                  setMode(Mode.Review);
                }}
              >
                Proceed
              </Button>
            )}
          </Flex>
        )}
        {mode === Mode.Review && (
          <Flex direction="column">
            <SearchSection setQuery={setQuery} />
          </Flex>
        )}

        {file && <PdfPreview file={file} query={query} />}
      </LayoutFlex>
    </>
  );
};
