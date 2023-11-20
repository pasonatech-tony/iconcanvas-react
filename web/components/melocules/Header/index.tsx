import { styled } from "@web/theme";

type Props = {
  title: string;
};

const Header: React.FC<Props> = ({ title }) => {
  return (
    <StyledHeader>
      <span style={{ padding: "0 5px" }}>{title}</span>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  flex: 0 0 auto;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-color);
  font-size: large;
  padding-top: 12px;
`;

export default Header;
