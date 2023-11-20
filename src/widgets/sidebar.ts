import * as turf from "@turf/turf";

import indicator from "../../dist/web/indicator/index.html?raw";
import html from "../../dist/web/sidebar/index.html?raw";
import type { MouseEvent } from "../apiType";
import type { actHandles } from "../type";

type Area = {
  id: string;
  layerId: string;
  radius: number;
  lng: number;
  lat: number;
};

type Model = {
  id: string;
  layerId: string;
};

type Label = {
  id: string;
  layerId: string;
};

type Marker = {
  lng: number;
  lat: number;
  url: string;
};
// ===============================
// Markers
// ===============================

const addMarker = (marker: Marker) => {
  // console.log("test: ", marker);

  (globalThis as any).reearth.layers.add({
    extensionId: "marker",
    isVisible: true,
    title: `Icon Marker`,
    property: {
      default: {
        location: {
          lat: marker.lat,
          lng: marker.lng,
        },
        image: marker.url,
        imageSize: 1,
      },
    },
  });
};

// ===============================
// Areas
// ===============================
const preloadPolygon = () => {
  const point = turf.point([0, 0], {
    stroke: "#000000",
    "stroke-opacity": 1,
    fill: "#000000",
    "fill-opacity": 0.5,
  });
  const buffered = turf.buffer(point, 0.1, { units: "kilometers" });
  const collection = turf.featureCollection([buffered]);
  (globalThis as any).reearth.layers.add({
    extensionId: "resource",
    isVisible: true,
    title: `Areas-Preload`,
    property: {
      default: {
        type: "geojson",
        url: collection,
        clampToGround: true,
      },
    },
  });
};
preloadPolygon();

// Add Area
let isAddingArea = false;
const areas: Area[] = [];

const areaColorHex =
  (globalThis as any).reearth.widget.property?.customize?.areacolor ??
  "#00FF3880";

const areaColor = areaColorHex.slice(0, 7);
const areaOpacity = parseInt(areaColorHex.slice(7, 9) || "ff", 16) / 256;

const areaStyle = {
  stroke: areaColor,
  "stroke-opacity": 1,
  fill: areaColor,
  "fill-opacity": areaOpacity,
};

const addArea = (lng: number, lat: number) => {
  const id = (areas.length + 1).toString();
  const radius = 50;

  const point = turf.point([lng, lat], areaStyle);
  const buffered = turf.buffer(point, radius * 0.001, { units: "kilometers" });
  const collection = turf.featureCollection([buffered]);

  const layerId = (globalThis as any).reearth.layers.add({
    extensionId: "resource",
    isVisible: true,
    title: `Areas-${id}`,
    property: {
      default: {
        type: "geojson",
        url: collection,
        clampToGround: true,
      },
    },
  });

  const area = {
    id,
    layerId,
    radius,
    lng,
    lat,
  };

  areas.push(area);

  (globalThis as any).reearth.ui.postMessage(
    JSON.stringify({ act: "addArea", payload: area })
  );
};

const updateArea = ({ id, radius }: { id: string; radius: number }) => {
  if (!radius) return;
  const area = areas.find((a) => a.id === id);
  if (!area) return;

  const point = turf.point([area.lng, area.lat], areaStyle);
  const buffered = turf.buffer(point, radius * 0.001, { units: "kilometers" });
  const collection = turf.featureCollection([buffered]);
  (globalThis as any).reearth.layers.overrideProperty(area.layerId, {
    default: {
      url: collection,
      type: "geojson",
    },
  });
};

const removeArea = (id: string) => {
  (globalThis as any).reearth.layers.hide(id);
};

// ===============================
// 3D Model
// ===============================
let isAddingModel = false;
const models: Model[] = [];

const modelUrl =
  (globalThis as any).reearth.widget.property?.customize?.modelurl ??
  "https://raw.githubusercontent.com/reearth/reearth-plugin-location-reservation-src/main/assets/tent.glb";

const scale =
  (globalThis as any).reearth.widget.property?.customize?.scale ?? "1";

const addModel = (lng: number, lat: number, height: number) => {
  if (!modelUrl) return;
  const id = (models.length + 1).toString();

  const layerId = (globalThis as any).reearth.layers.add({
    extensionId: "model",
    isVisible: true,
    title: `Model-${id}`,
    property: {
      default: {
        height,
        location: {
          lat,
          lng,
        },
        model: modelUrl,
        scale: parseFloat(scale),
        heightReference: "none",
      },
    },
  });

  const model = {
    id,
    layerId,
  };

  models.push(model);

  (globalThis as any).reearth.ui.postMessage(
    JSON.stringify({ act: "addModel", payload: model })
  );
};

const removeModel = (id: string) => {
  (globalThis as any).reearth.layers.hide(id);
};

// ===============================
// Label
// ===============================
let isAddingLabel = false;
const labels: Label[] = [];

const addLabel = (lng: number, lat: number) => {
  const id = (labels.length + 1).toString();

  const layerId = (globalThis as any).reearth.layers.add({
    extensionId: "marker",
    isVisible: true,
    title: `Label${id}`,
    property: {
      default: {
        location: {
          lat,
          lng,
        },
        height: 5,
        imageSize: 0,
        label: true,
        labelText: `Label`,
        labelPosition: "top",
        heightReference: "relative",
      },
    },
  });

  const label = {
    id,
    layerId,
  };

  labels.push(label);

  (globalThis as any).reearth.ui.postMessage(
    JSON.stringify({ act: "addLabel", payload: label })
  );
};

// update label
const updateLabel = ({ id, labeling }: { id: string; labeling: string }) => {
  if (!labeling) return;
  const label = labels.find((a) => a.id === id);
  if (!label) return;

  (globalThis as any).reearth.layers.overrideProperty(label.layerId, {
    default: {
      labelText: labeling,
    },
  });
};

const removeLabel = (id: string) => {
  (globalThis as any).reearth.layers.hide(id);
};

// ===============================
// Indicator
// ===============================
let localAddingStatus = "none";

const updateIndicator = (status: string) => {
  if (status === "none") {
    (globalThis as any).reearth.popup.close();
  } else {
    (globalThis as any).reearth.popup.show(indicator, {
      width: 355,
      height: 40,
      position: "right-start",
      offset: 8,
    });
    (globalThis as any).reearth.popup.postMessage({
      act: "initProperties",
      payload: {
        themeColor: (globalThis as any).reearth.widget.property?.customize
          ?.themecolor,
      },
    });
  }
};

// ===============================
// COMMON
// ===============================
const handles: actHandles = {
  setSidebarShown: (shown: boolean) => {
    if (shown) {
      (globalThis as any).reearth.ui.resize(350, 100, true);
    } else {
      (globalThis as any).reearth.ui.resize(40, 40, false);
    }
  },
  setAdding: (status: string) => {
    isAddingArea = status === "area";
    isAddingModel = status === "model";
    isAddingLabel = status === "label";
    if (status !== localAddingStatus) {
      updateIndicator(status);
    }
    localAddingStatus = status;
  },
  updateArea,
  removeArea,
  removeModel,
  removeLabel,
  updateLabel,
  download: () => {
    (globalThis as any).reearth.ui.postMessage({
      act: "getCaptureScreen",
      payload: (globalThis as any).reearth.scene.captureScreen(),
    });
  },
  addMarker,
};

(globalThis as any).reearth.ui.show(html, {
  width: 350,
  height: 100,
  extended: true,
});

(globalThis as any).reearth.ui.postMessage({
  act: "initProperties",
  payload: {
    title: (globalThis as any).reearth.widget.property?.customize?.title,
    canvasURL: (globalThis as any).reearth.widget.property?.customize
      ?.canvasurl,
    csvFile: (globalThis as any).reearth.widget.property?.customize?.csvurl,
    width: (globalThis as any).reearth.widget.property?.customize?.width,
    height: (globalThis as any).reearth.widget.property?.customize?.height,
    themeColor: (globalThis as any).reearth.widget.property?.customize
      ?.themecolor,
    modelURL: modelUrl,
  },
});

// ===============================
// Events
// ===============================
(globalThis as any).reearth.on("message", (msg: string) => {
  const data = JSON.parse(msg);
  if (data?.act) {
    handles[data.act]?.(data.payload);
  }
});

(globalThis as any).reearth.on("click", (msg: MouseEvent) => {
  if (!isAddingArea && !isAddingModel && !isAddingLabel) return;
  if (msg.lng !== undefined && msg.lat !== undefined) {
    if (isAddingArea) {
      addArea(msg.lng, msg.lat);
      isAddingArea = false;
    } else if (isAddingModel) {
      addModel(msg.lng, msg.lat, msg.height ?? 0);
      isAddingModel = false;
    } else if (isAddingLabel) {
      addLabel(msg.lng, msg.lat);
      isAddingLabel = false;
    }
  }
});
