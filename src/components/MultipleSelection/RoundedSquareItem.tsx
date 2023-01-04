import React, { FC } from "react";
import RoundedSquare from "./RoundedSquareShape";

interface IRoundedSquareItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setRoundRect: (data: any) => void;
  trRef: any;
}

const RoundedSquareItem: FC<IRoundedSquareItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setRoundRect,
  trRef,
}) => {
  const data =
    selectedElement === "roundRect"
      ? [...annotations, ...newAnnotation]
      : [...annotations];

  return (
    <>
      {data.map((rect: any, i) => {
        return (
          <RoundedSquare
            key={i}
            shapeProps={{
              x: rect.x,
              y: rect.y,
              width: Math.abs(rect.width),
              height: Math.abs(rect.height),
              cornerRadius: 10,
              fill: rect.fill || "transparent",
              strokeWidth: rect.strokeWidth,
              stroke: "black",
            }}
            onSelect={(e: any) => {
              if (e.current !== undefined) {
                trRef.current.nodes([e.current]);
                trRef.current.getLayer().batchDraw();
              }
            }}
            onChange={(newAttrs: any) => {
              setRoundRect((prev: any) =>
                prev.map((el: any, index: any) => {
                  if (index === i) {
                    el = newAttrs;
                  }
                  return el;
                })
              );
            }}
          />
        );
      })}
    </>
  );
};

export default RoundedSquareItem;
