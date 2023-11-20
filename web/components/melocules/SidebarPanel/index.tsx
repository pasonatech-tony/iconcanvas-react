import { styled } from "@web/theme";

type Props = {
  visible: boolean;
  children?: React.ReactNode;
};

const SidebarPanel: React.FC<Props> = ({ visible, children }: Props) => {
  return <StyledSidebarPanel visible={visible}>{children}</StyledSidebarPanel>;
};

const StyledSidebarPanel = styled.div`
  position: absolute;
  height: 100%;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  transition: all 0.25s ease;
  z-index: 2;
  transform: ${(props: any) =>
    props.visible ? "translate3d(0,0,0)" : "translate3d(-100%,0,0)"};
`;

export default SidebarPanel;
