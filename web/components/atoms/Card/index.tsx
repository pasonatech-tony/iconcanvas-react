import { styled } from "@web/theme";

type CardProps = {
  padding?: string;
  children?: React.ReactNode;
  flex?: string;
  gap?: string;
};

const Card: React.FC<CardProps> = ({ padding, children, flex, gap }) => {
  return (
    <Wrapper padding={padding} flex={flex} gap={gap}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.gap ?? "8px"};
  flex: ${(props: any) => props.flex ?? "none"};
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  padding: ${(props: any) => props.padding ?? "12px"};
`;

export default Card;
