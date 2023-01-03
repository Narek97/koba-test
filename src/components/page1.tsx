import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
  Group,
  Circle,
  Transformer,
} from "react-konva";
import Konva from "konva";

const ColoredRect = () => {
  const [color, setColor] = useState<string>("green");
  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
  };
  return (
    <Rect
      x={20}
      y={20}
      width={50}
      height={50}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
      draggable
    />
  );
};

const Page1 = () => {
  const stageRef = useRef<any>(null);
  const isDrawing = useRef(false);
  const trRef = useRef<any>(false);

  const [startDrawing, setStartDrawing] = useState("");
  const [boardClass, setBoardClass] = useState("");
  const [lines, setLines] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [itemType, setItemType] = useState<any>(null);

  function getItem(item: any) {
    if (item.type === "circle") {
      return <Circle x={item.x} y={item.y} fill="red" radius={20} />;
    }
    return (
      <>
        <Rect
          x={item.x}
          y={item.y}
          fill="green"
          width={20}
          height={20}
          ref={itemType}
        />
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </>
    );
  }

  const onDraw = () => {
    setBoardClass(startDrawing === "paint" ? "" : "paint");
    setStartDrawing((prev) => (prev === "paint" ? "" : "paint"));
  };

  const onCircle = () => {
    setBoardClass((prev) => (prev === "circle" ? "" : "circle"));
    setStartDrawing(startDrawing === "circle" ? "" : "circle");
  };

  const handleMouseDown = (e: any, type?: string) => {
    const pos = e.target.getStage().getPointerPosition();
    if (startDrawing === "paint") {
      isDrawing.current = true;
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
    if (startDrawing === "circle") {
      setItems([
        ...items,
        {
          x: pos.x,
          y: pos.y,
          type,
        },
      ]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (startDrawing === "paint") {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    if (startDrawing === "paint") {
      isDrawing.current = false;
    }
  };

  console.log(items);

  return (
    <div className={"canvas"}>
      <div className={"header"}>
        <button onClick={onDraw}>Paint</button>
        <button onClick={onCircle}>Circle</button>
        <button onClick={() => {}}>Rectangle</button>
      </div>
      <Stage
        width={600}
        height={600}
        className={`board ${boardClass}`}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line: any, i: any) => (
            <Line
              draggable
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
        <Layer>{items.map(getItem)}</Layer>
      </Stage>
    </div>
  );
};

export default Page1;
