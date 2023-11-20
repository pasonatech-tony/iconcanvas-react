import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useState, useEffect, useMemo, useCallback } from "react";

export type Area = {
  id: string;
  layerId: string;
  radius: number;
};

export type Model = {
  id: string;
  layerId: string;
};

export type Label = {
  id: string;
  layerId: string;
};

export type Marker = {
  lng: number;
  lat: number;
  url: string;
};

export default () => {
  // canvas url
  const [canvasURL] = useState<string>(
    (window as any).pluginInitProperties?.canvasURL ?? ""
  );

  //csv file
  const [csvFile] = useState<string>(
    (window as any).pluginInitProperties?.csvFile ?? ""
  );

  //width, height
  const [width] = useState<string>(
    (window as any).pluginInitProperties?.width ?? 100
  );
  const [height] = useState<string>(
    (window as any).pluginInitProperties?.height ?? 100
  );

  // add status
  const [addingStatus, setAddingStatus] = useState<string>("none");
  const setAdding = useCallback((status: string) => {
    setAddingStatus(status);
    postMsg("setAdding", status);
  }, []);

  const addBtnStyle = useMemo(() => {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: 0,
    };
  }, []);

  // areas
  const [areaList, setAreaList] = useState<Area[]>([]);

  const addArea = useCallback(
    (area: Area) => {
      setAreaList((list) => [...list, area]);
      setAdding("none");
    },
    [setAdding]
  );

  const updateArea = useCallback((id: string, radius: number) => {
    postMsg("updateArea", { id, radius });
  }, []);

  const removeArea = useCallback((id: string, layerId: string) => {
    setAreaList((list) => list.filter((a) => a.id !== id));
    postMsg("removeArea", layerId);
  }, []);

  const startAddingArea = useCallback(() => {
    const isAddingArea = addingStatus === "area";
    setAdding(isAddingArea ? "none" : "area");
  }, [addingStatus, setAdding]);

  const addAreaBtnStyle = useMemo(() => {
    return {
      ...addBtnStyle,
      color: addingStatus === "area" ? "rgba(0, 0, 0, 0.25)" : "#FFF",
      background: addingStatus === "area" ? "#F5F5F5" : "var(--theme-color)",
      borderColor: addingStatus === "area" ? "#D9D9D9" : "var(--theme-color)",
    };
  }, [addBtnStyle, addingStatus]);

  // models
  const [modelList, setModelList] = useState<Model[]>([]);
  const [modelURL] = useState<string>(
    (window as any).pluginInitProperties?.modelURL ?? ""
  );

  const addModel = useCallback(
    (model: Model) => {
      setModelList((list) => [...list, model]);
      setAdding("none");
    },
    [setAdding]
  );

  const removeModel = useCallback((id: string, layerId: string) => {
    setModelList((list) => list.filter((a) => a.id !== id));
    postMsg("removeModel", layerId);
  }, []);

  const startAddingModel = useCallback(() => {
    const isAddingModel = addingStatus === "model";
    setAdding(isAddingModel ? "none" : "model");
  }, [addingStatus, setAdding]);

  const addModelBtnStyle = useMemo(() => {
    return {
      ...addBtnStyle,
      color: addingStatus === "model" ? "rgba(0, 0, 0, 0.25)" : "#FFF",
      background: addingStatus === "model" ? "#F5F5F5" : "var(--theme-color)",
      borderColor: addingStatus === "model" ? "#D9D9D9" : "var(--theme-color)",
    };
  }, [addBtnStyle, addingStatus]);

  //markers
  const addMarker = useCallback((marker: Marker) => {
    postMsg("addMarker", marker);
  }, []);

  // labels
  const [labelList, setLabelList] = useState<Label[]>([]);

  const addLabel = useCallback(
    (label: Label) => {
      setLabelList((list) => [...list, label]);
      setAdding("none");
    },
    [setAdding]
  );

  const updateLabel = useCallback((id: string, labeling: string) => {
    postMsg("updateLabel", { id, labeling });
  }, []);

  const removeLabel = useCallback((id: string, layerId: string) => {
    setLabelList((list) => list.filter((a) => a.id !== id));
    postMsg("removeLabel", layerId);
  }, []);

  const startAddingLabel = useCallback(() => {
    const isAddingLabel = addingStatus === "label";
    setAdding(isAddingLabel ? "none" : "label");
  }, [addingStatus, setAdding]);

  const addLabelBtnStyle = useMemo(() => {
    return {
      ...addBtnStyle,
      color: addingStatus === "label" ? "rgba(0, 0, 0, 0.25)" : "#FFF",
      background: addingStatus === "label" ? "#F5F5F5" : "var(--theme-color)",
      borderColor: addingStatus === "label" ? "#D9D9D9" : "var(--theme-color)",
    };
  }, [addBtnStyle, addingStatus]);

  // common
  const actHandles: actHandles = useMemo(() => {
    return {
      addArea,
      addModel,
      addLabel,
      addMarker,
    };
  }, [addArea, addModel, addLabel, addMarker]);

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

  return {
    addingStatus,
    areaList,
    updateArea,
    removeArea,
    startAddingArea,
    addAreaBtnStyle,
    modelList,
    modelURL,
    canvasURL,
    width,
    height,
    removeModel,
    startAddingModel,
    addModelBtnStyle,
    labelList,
    updateLabel,
    removeLabel,
    startAddingLabel,
    addLabelBtnStyle,
    addMarker,
    csvFile,
  };
};
