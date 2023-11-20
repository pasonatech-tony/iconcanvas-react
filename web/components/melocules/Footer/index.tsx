import Icon from "@web/components/atoms/Icon";
import { styled } from "@web/theme";
import { Button } from "antd";

type Props = {
  handleDownloadClick: () => void;
};

const Footer: React.FC<Props> = ({ handleDownloadClick }) => {
  return (
    <>
      <StyledFooter>
        <Button
          href="https://marketplace.reearth.io/plugins/reearth-plugin-location-reservation"
          target="_blank"
          style={{
            padding: "0 10px",
          }}
        >
          <LinkWrapper>
            <Icon icon="question" size={16} />
            <span style={{ lineHeight: "22px" }}>Read me</span>
          </LinkWrapper>
        </Button>
        <Button
          onClick={handleDownloadClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0 10px",
          }}
        >
          <Icon icon="map" size={16} />
          <span>地図画面のダウンロード</span>
        </Button>
      </StyledFooter>
    </>
  );
};

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  flex: 0 0 auto;
  height: 46px;
  padding: 0px 16px;
  gap: 10px;
`;

const LinkWrapper = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export default Footer;
