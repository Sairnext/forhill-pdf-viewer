import styled from "styled-components";

export const CollapsableContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 300px;
  height: fit-content;
  color: white;
  border-radius: 8px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 8px;

  background: rgb(74, 74, 74);

  &:hover {
    cursor: pointer;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;

  background: white;
  border-radius: 0px 0px 8px 8px;
  color: black;
  max-height: 560px;
  overflow: scroll;
`;
