import React, { FC } from "react";
import { Arrow } from "react-konva";

interface ICustomArrow {
  startPos: any;
  endPos: any;
}

const CustomArrow: FC<ICustomArrow> = ({ startPos, endPos }) => {
  return (
    <Arrow
      points={[startPos.x, startPos.y, endPos.x, endPos.y]}
      pointerLength={20}
      pointerWidth={20}
      draggable
      fill="black"
      stroke="black"
      strokeWidth={4}
      name={"arrow"}
    />
  );
};

export default CustomArrow;
