import React, { FC } from "react";
import RectangleShape from "./RectangleShape";

interface IRectangleShapeItem {
  annotations: [];
  newAnnotation: [];
  selectedElement: string;
  setAnnotations: (data: any) => void;
  trRef: any;
}

const RectangleShapeItem: FC<IRectangleShapeItem> = ({
  annotations,
  newAnnotation,
  selectedElement,
  setAnnotations,
  trRef,
}) => {
  const data =
    selectedElement === "rect"
      ? [...annotations, ...newAnnotation]
      : [...annotations];

  return (
    <>
      {data.map((rect: any, i) => {
        return (
          <RectangleShape
            key={i}
            shapeProps={{ ...rect, stroke: "black" }}
            onSelect={(e: any) => {
              if (e.current !== undefined) {
                trRef.current.nodes([e.current]);
                trRef.current.getLayer().batchDraw();
              }
            }}
            onChange={(newAttrs: any) => {
              setAnnotations((prev: any) =>
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

export default RectangleShapeItem;
