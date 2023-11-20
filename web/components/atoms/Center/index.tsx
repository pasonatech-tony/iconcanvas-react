import { styled } from "@web/theme";

type Props = {
  children?: React.ReactNode;
  gap?: string;
};

const Center: React.FC<Props> = ({ children, gap }) => {
  return <Wrapper gap={gap}>{children}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props: any) => props.gap ?? 0};
`;

export default Center;
