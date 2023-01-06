import React, { FC, useEffect, useState } from "react";
import { Circle } from "react-konva";
import CustomArrow from "./CustomArrow";
import RoundedSquare from "./RoundedSquareShape";

interface ICustomArrowItem {
  arrows: any;
  newAnnotation: any;
  selectedElement: any;
  setArrows: any;
  trRef: any;
}

const CustomArrowItem: FC<ICustomArrowItem> = ({
  arrows,
  newAnnotation,
  selectedElement,
  setArrows,
  trRef,
}) => {
  const data =
    selectedElement === "arrow" ? [...arrows, ...newAnnotation] : [...arrows];

  return (
    <>
      {data.map((arrow: any, i) => {
        return (
          <CustomArrow
            key={i}
            shapeProps={arrow}
            onSelect={(e: any) => {
              if (e.current !== undefined) {
                trRef.current.nodes([e.current]);
                trRef.current.getLayer().batchDraw();
              }
            }}
            onChange={(newAttrs: any) => {
              setArrows((prev: any) =>
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

export default CustomArrowItem;
