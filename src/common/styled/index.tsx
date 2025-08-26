import styled from "styled-components";

interface FlexProps {
    gap?: string;
    justify?: string;
    align?: string;
    direction?: string;
}

export const Flex = styled.div<FlexProps>`
    display: flex;
    gap: ${({ gap }) => gap || "1rem"};
    justify-content: ${({ justify }) => justify || "flex-start"};
    align-items: ${({ align }) => align || "stretch"};
    flex-direction: ${({ direction }) => direction || "row"};
`;
