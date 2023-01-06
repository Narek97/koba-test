import React, { FC, useRef } from "react";
import { Arrow, Circle, Line } from "react-konva";

interface ICustomArrow {
  shapeProps: any;
  onSelect: any;
  onChange: any;
}

const CustomArrow: FC<ICustomArrow> = ({ shapeProps, onSelect, onChange }) => {
  const arrowRef = useRef<any>(null);
  const { arrowStartPos, arrowEndPos } = shapeProps;

  return (
    <>
      <Arrow
        onClick={() => onSelect(arrowRef)}
        onTap={() => onSelect(arrowRef)}
        ref={arrowRef}
        points={[
          arrowStartPos.x,
          arrowStartPos.y,
          // (arrowStartPos.x + arrowEndPos.x) / 2,
          // (arrowStartPos.y + arrowEndPos.y) / 2,
          arrowEndPos.x,
          arrowEndPos.y,
        ]}
        // pointerAtBeginning
        pointerLength={20}
        pointerWidth={20}
        // strokeWidth={4}
        draggable
        fill="black"
        stroke="black"
        name={"arrow"}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            arrowStartPos: {
              x: arrowStartPos.x + e.target.x(),
              y: arrowStartPos.y + e.target.y(),
            },
            arrowEndPos: {
              x: arrowEndPos.x + e.target.x(),
              y: arrowEndPos.y + e.target.y(),
            },
          });
        }}
      />
      <Circle
        id="from"
        {...shapeProps?.arrowStartPos}
        fill="blue"
        width={10}
        height={10}
        draggable
        onDragMove={(e) => {
          onChange({
            ...shapeProps,
            arrowStartPos: {
              ...e.target.position(),
            },
          });
        }}
      />
      <Circle
        id="to"
        {...shapeProps?.arrowEndPos}
        fill="blue"
        width={10}
        height={10}
        draggable
        onDragMove={(e) => {
          onChange({
            ...shapeProps,
            arrowEndPos: {
              ...e.target.position(),
            },
          });
        }}
      />
    </>
  );
};

export default CustomArrow;
