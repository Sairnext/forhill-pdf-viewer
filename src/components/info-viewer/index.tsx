import { useMemo } from "react";
import { getPdfBasicInfo, type PdfBasicInfo } from "@common/utils/parsePDF";
import { usePromiseOrNull } from "@common/hooks/usePromiseOrNull.tsx";
import { Bullet } from "@common/components/Bullet.tsx";

import { InfoViewerWrapper } from "./styled";

interface Props {
  file: File;
}

export const InfoViewer: React.FC<Props> = ({ file }) => {
  const infoPromise = useMemo(() => getPdfBasicInfo(file), [file]);
  const meta = usePromiseOrNull<PdfBasicInfo>(infoPromise);

  return meta ? (
    <InfoViewerWrapper>
      <Bullet label={`Name of Document - ${meta.name}`} active={true} />
      <Bullet label={`Number of Pages - ${meta.numPages}`} active={true} />
      <Bullet label={`Extension - ${meta.extension}`} active={true} />
      <Bullet label={`Type - ${meta.type}`} active={true} />
    </InfoViewerWrapper>
  ) : null;
};
