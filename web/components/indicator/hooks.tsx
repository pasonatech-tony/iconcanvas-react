import type { actHandles } from "@web/types";
import { ConfigProvider } from "antd";
import { useEffect, useMemo, useCallback } from "react";

export default () => {
  const updateTheme = useCallback((color?: string) => {
    const themeColor = color ? color : "#00BEBE";
    document.documentElement.style.setProperty("--theme-color", themeColor);
    ConfigProvider.config({
      theme: {
        primaryColor: themeColor,
      },
    });
  }, []);

  // common
  const actHandles: actHandles = useMemo(() => {
    return {};
  }, []);

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

  useEffect(() => {
    updateTheme((window as any).pluginInitProperties?.themeColor);
  }, [updateTheme]);

  return {
    ConfigProvider,
  };
};
