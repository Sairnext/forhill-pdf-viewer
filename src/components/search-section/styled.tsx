import styled from "styled-components";
import { Search } from "lucide-react";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 560px;
  gap: 12px;
`;

export const SearchInput = styled.input`
  min-height: 32px;
  background: white;
  border: none;
  border-radius: 25px;
  min-width: 300px;
  outline: none;

  padding: 0px 6px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;

  &:hover {
    cursor: pointer;
  }
`;

export const StyledSearch = styled(Search)`
  position: absolute;
  right: 10px;
`;
