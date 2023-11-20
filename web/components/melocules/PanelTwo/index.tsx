import Card from "../../atoms/Card";

type Props = {
  iframeURL?: string;
};

const PanelTwo: React.FC<Props> = ({ iframeURL }) => {
  return (
    <Card padding="0" flex="auto">
      <iframe
        src={iframeURL}
        frameBorder="0"
        style={{
          position: "absolute",
          height: "calc(100%/0.8)",
          width: "calc(100%/0.8)",
          transform: "scale(0.8)",
          transformOrigin: "0 0",
        }}
      ></iframe>
    </Card>
  );
};

export default PanelTwo;
