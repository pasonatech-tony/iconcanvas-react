import Center from "../Center";
import Icon from "../Icon";

type Props = {
  icon?: string;
  text?: string;
};

const Tab: React.FC<Props> = ({ icon, text }) => {
  return (
    <Center gap="8px">
      {icon && <Icon icon={icon} size={20} />}
      {text && <span>{text}</span>}
    </Center>
  );
};

export default Tab;
