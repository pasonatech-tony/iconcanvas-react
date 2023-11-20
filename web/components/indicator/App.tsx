/// <reference types="vite-plugin-svgr/client" />

import Icon from "@web/components/atoms/Icon";
import { styled } from "@web/theme";

import useHooks from "./hooks";

import "./global.css";

const App = () => {
  const { ConfigProvider } = useHooks();

  return (
    <ConfigProvider>
      <Wrapper>
        <Icon icon="info" size={16} />
        <span>地図をクリックして場所を指定してください</span>
      </Wrapper>
    </ConfigProvider>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 355px;
  height: 40px;
  background-color: var(--theme-color);
  border-radius: 2px;
  gap: 8px;
`;

export default App;
