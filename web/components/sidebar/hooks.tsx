import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { ConfigProvider } from "antd";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

import Tab from "../atoms/Tab";
import PanelOne from "../melocules/PanelOne";

type widgetProperties = {
  title: string;
  canvasURL: string;
  themeColor: string;
  modelURL: string;
};

export default () => {
  // properties
  const [title, setTitle] = useState<string>(
    (window as any).pluginInitProperties?.title
      ? (window as any).pluginInitProperties?.title
      : "Icon Canvas"
  );

  const [canvasURL, setCanvasURL] = useState<string>(
    (window as any).pluginInitProperties?.canvasURL ?? ""
  );

  const updateTheme = useCallback((color?: string) => {
    const themeColor = color ? color : "#00BEBE";
    document.documentElement.style.setProperty("--theme-color", themeColor);
    ConfigProvider.config({
      theme: {
        primaryColor: themeColor,
      },
    });
  }, []);

  const updateProperties = useCallback(
    ({ title, canvasURL, themeColor }: widgetProperties) => {
      setTitle(title);
      setCanvasURL(canvasURL);
      updateTheme(themeColor);
    },
    [updateTheme]
  );

  // download map
  const isRequestingMap = useRef(false);

  const getCaptureScreen = useCallback((payload: string) => {
    isRequestingMap.current = false;
    const fileName = "capture.png";
    const link = document.createElement("a");
    link.download = fileName;
    link.href = payload;
    // console.log("link href: ", payload);
    link.click();
    link.remove();
  }, []);

  const handleDownloadClick = useCallback(() => {
    if (!isRequestingMap.current) {
      postMsg("download");
      isRequestingMap.current = true;
    }
  }, []);

  // UI
  const [isSidebarShown, setSidebarShown] = useState(true);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
    setTimeout(() => {
      postMsg("setSidebarShown", false);
    }, 250);
  }, []);

  const showSidebar = useCallback(() => {
    postMsg("setSidebarShown", true);
    setTimeout(() => {
      setSidebarShown(true);
    }, 100);
  }, []);

  // common
  const actHandles: actHandles = useMemo(() => {
    return {
      updateProperties,
      getCaptureScreen,
    };
  }, [updateProperties, getCaptureScreen]);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent) return;
      try {
        const data =
          typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;
        actHandles[data.act as keyof actHandles]?.(data.payload);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // items
  const items = useMemo(() => {
    const items = [
      {
        label: <Tab icon="pencil" text="描画ツール" />,
        key: "item-1",
        children: <PanelOne />,
        canvasURL: canvasURL,
      },
    ];

    return items;
  }, [canvasURL]);

  useEffect(() => {
    updateTheme((window as any).pluginInitProperties?.themeColor);
  }, [updateTheme]);

  return {
    items,
    title,
    canvasURL,
    isSidebarShown,
    hideSidebar,
    showSidebar,
    handleDownloadClick,
    ConfigProvider,
  };
};
