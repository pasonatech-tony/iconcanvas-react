/// <reference types="vite-plugin-svgr/client" />

import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";

import Content from "../melocules/Content";
// import Footer from "../melocules/Footer";
import Header from "../melocules/Header";
import SidebarPanel from "../melocules/SidebarPanel";

import useHooks from "./hooks";

import "./global.css";

const App = () => {
  const {
    items,
    title,
    isSidebarShown,
    hideSidebar,
    showSidebar,
    // handleDownloadClick,
    ConfigProvider,
  } = useHooks();

  // console.log("canvasURL: ", items);

  return (
    <ConfigProvider>
      <Button
        type="default"
        icon={<MenuOutlined />}
        size={"large"}
        onClick={showSidebar}
        style={{ position: "absolute", border: "none" }}
      />
      <SidebarPanel visible={isSidebarShown}>
        <Button
          type="primary"
          icon={<CloseOutlined />}
          size={"middle"}
          onClick={hideSidebar}
          style={{ position: "absolute", right: "0", borderRadius: "0" }}
        />
        <Header title={title} />
        <Content>
          <Tabs centered items={items} />
        </Content>
        {/* <Footer handleDownloadClick={handleDownloadClick} /> */}
      </SidebarPanel>
    </ConfigProvider>
  );
};

export default App;
