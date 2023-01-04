import React, { FC } from "react";
import EllipseShape from "./EllipseShape";

interface IEllipseShapeItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setEllipse: (data: any) => void;
  trRef: any;
}

const EllipseShapeItem: FC<IEllipseShapeItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setEllipse,
  trRef,
}) => {
  const data =
    selectedElement === "ellipse"
      ? [...annotations, ...newAnnotation]
      : [...annotations];

  return (
    <>
      {data.map((ellipse: any, i) => {
        return (
          <EllipseShape
            key={i}
            shapeProps={{
              ...ellipse,
              x: ellipse.x,
              y: ellipse.y,
              radiusX: Math.abs(ellipse.width),
              radiusY: Math.abs(ellipse.height),
              stroke: "black",
            }}
            onSelect={(e: any) => {
              if (e.current !== undefined) {
                trRef.current.nodes([e.current]);
                trRef.current.getLayer().batchDraw();
              }
            }}
            onChange={(newAttrs: any) => {
              setEllipse((prev: any) =>
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

export default EllipseShapeItem;
