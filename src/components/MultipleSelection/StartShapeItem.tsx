import React, { FC } from "react";
import EllipseShape from "./EllipseShape";
import TriangleShape from "./TriangleShape";
import StarShape from "./StarShape";

interface IStartShapeItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setTriangle: (data: any) => void;
  trRef: any;
}

const StartShapeItem: FC<IStartShapeItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setTriangle,
  trRef,
}) => {
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
              setTriangle((prev: any) =>
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
