import React, { FC } from "react";
import EllipseShape from "./EllipseShape";
import TriangleShape from "./TriangleShape";

interface ITriangleShapeItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setTriangle: (data: any) => void;
  trRef: any;
}

const TriangleShapeItem: FC<ITriangleShapeItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setTriangle,
  trRef,
}) => {
  const data =
    selectedElement === "triangle"
      ? [...annotations, ...newAnnotation]
      : [...annotations];

  return (
    <>
      {data.map((ellipse: any, i) => {
        return (
          <TriangleShape
            key={i}
            shapeProps={{
              ...ellipse,
              x: ellipse.x,
              y: ellipse.y,
              points: [
                0,
                0,
                ellipse.width / 2,
                ellipse.height,
                ellipse.width,
                0,
              ],
              closed: true,
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

export default TriangleShapeItem;
