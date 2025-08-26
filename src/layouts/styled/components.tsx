import styled from "styled-components";

import { Flex } from "@common/styled";

export const LayoutWrapper = styled.div`
  background: #f2f2f2;
  width: 100%;
  height: 100%;
`;

export const LayoutFlex = styled(Flex)`
  padding: 64px;
`;

export const Button = styled.button`
  padding: 4px;
  background: black;
  color: white;

  border-radius: 10px;

  max-width: 150px;

  &:hover {
    background: white;
    color: black;
    border: 1px solid black;
    cursor: pointer;
  }
`;
