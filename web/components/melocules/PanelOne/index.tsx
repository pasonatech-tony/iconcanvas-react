import Icon from "@web/components/atoms/Icon";
import Input from "@web/components/atoms/Input";
import { styled } from "@web/theme";
import { Slider, Button } from "antd";
import { csv } from "d3";
import { useState, ChangeEvent, useRef, useEffect } from "react";

import Card from "../../atoms/Card";

import useHooks from "./hooks";

// type CanvasProps = {
//   url: string;
//   canvas: HTMLCanvasElement;
//   input: string[];
// };

const PanelOne: React.FC = () => {
  const {
    areaList,
    updateArea,
    removeArea,
    startAddingArea,
    addAreaBtnStyle,
    modelList,
    modelURL,
    width,
    height,
    canvasURL,
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
  } = useHooks();

  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [csvData, setCsvData] = useState([]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  //read csv

  useEffect(() => {
    if (!csvFile) return;

    csv(csvFile).then((data: any) => {
      // console.log(data);
      const first100Records = data.slice(0, 100);
      setCsvData(first100Records);
    });
  }, [csvFile]);

  //Hanlde with UI elements
  const drawNewImage = async (
    url: string,
    canvas: HTMLCanvasElement,
    input: string[]
  ) => {
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = url;
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    // Set the font properties for the text
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate the middle position of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw the first text in the middle
    ctx.fillText(input[0], centerX, centerY);

    // Draw the second text in the middle
    ctx.fillText(input[1], centerX, centerY + 10);
  };
  //End handle with UI elements

  const handleDraw = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    //csv data
    // console.log("csvFile: ", csvFile);

    //draw canvas
    if (!canvasRef.current) return;
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await drawNewImage(canvasURL, canvasRef.current, [name, time]);

    // console.log("csvData: ", csvData);

    if (csvData.length > 0) {
      const randomNumber = Math.floor(Math.random() * csvData.length);

      addMarker({
        lng: parseFloat(
          csvData[randomNumber]["'lon'"] || csvData[randomNumber]["lon"]
        ),
        lat: parseFloat(
          csvData[randomNumber]["'lat'"] || csvData[randomNumber]["lat"]
        ),
        url: canvas.toDataURL(),
      });
    } else {
      console.log("csvData array is empty");
    }
  };

  const handleDownload = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    // console.log("download new image...");
    // download icon
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL();
    downloadLink.download = "icon.png";
    downloadLink.click();
    downloadLink.remove();
  };

  return (
    <>
      {!true && (
        <Card>
          <Button
            type="primary"
            onClick={startAddingArea}
            style={addAreaBtnStyle}
          >
            {/* {addingStatus !== "area" && <Icon icon="circle" size={16} />}
          <span>
            {addingStatus === "area"
              ? "地図をクリックして場所を指定してください"
              : "エリアを追加する"}
          </span> */}
            <Icon icon="circle" size={16} />
            <span>エリアを追加する</span>
          </Button>

          {/* {addingStatus !== "area" && (
          <EmptyTip>ボタンをクリックすると描画を開始します</EmptyTip>
        )} */}

          {areaList.map((area, index) => (
            <Card padding="0" gap="0" key={area.id}>
              <CardHeader>
                <CardTitle>Area {index + 1}</CardTitle>
                <DeleteButton onClick={() => removeArea(area.id, area.layerId)}>
                  <Icon icon="trash" />
                </DeleteButton>
              </CardHeader>
              <CardSettings>
                <CardSettingsTitle>半径</CardSettingsTitle>
                <CardSettingsTool>
                  <Slider
                    min={1}
                    max={100}
                    defaultValue={50}
                    onAfterChange={(value) => {
                      updateArea(area.id, value);
                    }}
                  />
                </CardSettingsTool>
              </CardSettings>
            </Card>
          ))}
        </Card>
      )}

      {!true && !!modelURL && (
        <Card>
          <Button
            type="primary"
            onClick={startAddingModel}
            style={addModelBtnStyle}
          >
            {/* {addingStatus !== "model" && <Icon icon="model" size={16} />}
            <span>
              {addingStatus === "model"
                ? "地図をクリックして場所を指定してください"
                : "3Dモデルを追加する"}
            </span> */}
            <Icon icon="model" size={16} />
            <span>3Dモデルを追加する</span>
          </Button>

          {/* {addingStatus !== "model" && (
            <EmptyTip>ボタンをクリックすると描画を開始します</EmptyTip>
          )} */}

          {modelList.map((model, index) => (
            <Card padding="0" gap="0" key={model.id}>
              <CardSettings>
                <CardTitle>Model {index + 1}</CardTitle>
                <DeleteButton
                  onClick={() => removeModel(model.id, model.layerId)}
                >
                  <Icon icon="trash" />
                </DeleteButton>
              </CardSettings>
            </Card>
          ))}
        </Card>
      )}

      {
        <CanvasWrapper>
          <canvas
            ref={canvasRef}
            id="myCanvas"
            width={width}
            height={height}
          ></canvas>
        </CanvasWrapper>
      }

      <Input
        type="text"
        id="Name"
        value={name}
        name="name"
        onChange={handleNameChange}
        placeholder="Please enter your name"
      />

      <Input
        type="text"
        id="Time"
        value={time}
        name="time"
        onChange={handleTimeChange}
        placeholder="Please enter your time"
      />

      <Button color="red" onClick={handleDraw}>
        Draw
      </Button>

      <Button color="blue" onClick={handleDownload}>
        Download
      </Button>

      {!true && (
        <Card>
          <Button
            type="primary"
            onClick={startAddingLabel}
            style={addLabelBtnStyle}
          >
            {/* {addingStatus !== "label" && <Icon icon="text" size={16} />}
          <span>
            {addingStatus === "label"
              ? "地図をクリックして場所を指定してください"
              : "テキストを追加する"}
          </span> */}
            <Icon icon="text" size={16} />
            <span>テキストを追加する</span>
          </Button>

          {/* {addingStatus !== "label" && (
          <EmptyTip>ボタンをクリックすると描画を開始します</EmptyTip>
        )} */}

          {labelList.map((label) => (
            <Card padding="0" gap="0" key={label.id}>
              <CardSettings>
                <CardSettingsLabel
                  type={"text"}
                  defaultValue={"Label"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateLabel(label.id, event.target.value);
                  }}
                />
                <DeleteButton
                  onClick={() => removeLabel(label.id, label.layerId)}
                >
                  <Icon size={16} icon="trash" />
                </DeleteButton>
              </CardSettings>
            </Card>
          ))}
        </Card>
      )}
    </>
  );
};

// const EmptyTip = styled.div`
//   color: #8c8c8c;
//   text-align: center;
// `;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  border-bottom: 1px solid #e0e0e0;
  color: rgba(0, 0, 0, 0.85);
`;

const CardTitle = styled.div``;

const DeleteButton = styled.a`
  display: flex;
  align-items: center;
`;

const CardSettings = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 12px;
`;

const CardSettingsTitle = styled.div``;
const CardSettingsLabel = styled.input`
  width: 100%;
  border: 1px #d9d9d9 solid;
  border-radius: 2px;
  height: 32px;
  line-height: 32px;
  padding: 5px 12px;
  outline: none;
  font-size: 14px;
`;

const CardSettingsTool = styled.div`
  flex: auto;
`;
const CanvasWrapper = styled.div`
  width: 100%;
  height: 150px;
  max-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  overflow-x: hidden;
`;

export default PanelOne;
