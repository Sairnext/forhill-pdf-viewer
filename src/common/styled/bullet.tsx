import styled from "styled-components";

export const BulletWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 4px;
`;

export const Label = styled.div`
  font-size: 16px;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
