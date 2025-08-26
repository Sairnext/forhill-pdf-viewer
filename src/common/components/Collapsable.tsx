import { useState, useEffect, type ReactNode } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { CollapsableContainer, Header, Body } from "@common/styled/collapsable";

interface Props {
  label: string;
  children: ReactNode;
  isOpened?: boolean;
}

export const Collapsable: React.FC<Props> = ({ label, children, isOpened }) => {
  const [opened, setOpened] = useState(isOpened ?? false);

  const setCollapsable = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    setOpened(!!isOpened);
  }, [isOpened]);

  return (
    <CollapsableContainer>
      <Header onClick={setCollapsable}>
        <div>
          <strong>{label}</strong>
        </div>
        {opened ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </Header>
      {opened && <Body>{children}</Body>}
    </CollapsableContainer>
  );
};
