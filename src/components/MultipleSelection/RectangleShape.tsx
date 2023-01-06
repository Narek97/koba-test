import React, { FC, useRef, useState } from "react";
import { KonvaNodeComponent, Rect } from "react-konva";
import Konva from "konva";
import TRect = Konva.Rect;

interface IRectangle {
  shapeProps: any;
  onSelect: any;
  onChange: any;
}

const RectangleShape: FC<IRectangle> = ({ shapeProps, onSelect, onChange }) => {
  const shapeRef = useRef<KonvaNodeComponent<TRect>>(null);
  // rotate bug
  return (
    <Rect
      onClick={() => onSelect(shapeRef)}
      onTap={() => onSelect(shapeRef)}
      // ref={shapeRef.current[getKey]}
      ref={shapeRef}
      {...shapeProps}
      dash={[10, 10]}
      name="rectangle"
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node: any = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export default RectangleShape;
