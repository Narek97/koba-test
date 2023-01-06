import React, { FC, useState } from "react";
import StarShape from "./StarShape";

interface IStartShapeItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setStar: (data: any) => void;
  trRef: any;
}

const StartShapeItem: FC<IStartShapeItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setStar,
  trRef,
}) => {
  // rotate bug
  const data =
    selectedElement === "star"
      ? [...annotations, ...newAnnotation]
      : [...annotations];

  return (
    <>
      {data.map((star: any, i) => {
        return (
          <StarShape
            key={i}
            shapeProps={{
              ...star,
              fill: star.fill || "transparent",
              innerRadius: star.width,
              outerRadius: star.width / 2,
              rotation: star.width > 0 ? -180 : 0,
              numPoints: 5,
              height: 0,
              stroke: "black",
            }}
            onSelect={(e: any) => {
              if (e.current !== undefined) {
                trRef.current.nodes([e.current]);
                trRef.current.getLayer().batchDraw();
              }
            }}
            onChange={(newAttrs: any) => {
              setStar((prev: any) =>
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

export default StartShapeItem;
