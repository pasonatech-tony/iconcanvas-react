import { styled } from "@web/theme";

type Props = {
  children?: React.ReactNode;
};

const Content: React.FC<Props> = ({ children }: Props) => {
  return <StyledContent>{children}</StyledContent>;
};

const StyledContent = styled.div`
  height: 0;
  flex: auto;
  display: flex;
  flex-direction: column;
`;

export default Content;
