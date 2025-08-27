import { ChevronLeft, ChevronRight } from "lucide-react";

import { Flex } from "@common/styled";
import { StyledNavButtons } from "./styles.tsx";

interface Props {
  handleNavigation: (num: number) => void;
}

export const FileNavigationBar: React.FC<Props> = ({ handleNavigation }) => {
  return (
    <Flex gap="4px" align="center" justify="center">
      <StyledNavButtons onClick={() => handleNavigation(-1)}>
        <ChevronLeft size={16} />
      </StyledNavButtons>
      <StyledNavButtons onClick={() => handleNavigation(1)}>
        <ChevronRight size={16} />
      </StyledNavButtons>
    </Flex>
  );
};
