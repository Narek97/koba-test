import React, { FC, useRef } from "react";
import { Ellipse, KonvaNodeComponent, Line } from "react-konva";
import Konva from "konva";
import TRect = Konva.Rect;

interface ITriangleShape {
  shapeProps: any;
  onSelect: any;
  onChange: any;
}

const TriangleShape: FC<ITriangleShape> = ({
  shapeProps,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<KonvaNodeComponent<TRect>>(null);
  return (
    <Line
      onClick={() => onSelect(shapeRef)}
      onTap={() => onSelect(shapeRef)}
      // ref={shapeRef.current[getKey]}
      ref={shapeRef}
      {...shapeProps}
      dash={[10, 10]}
      name="triangle"
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
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
          points: [
            0,
            0,
            (node.width() / 2) * scaleX,
            node.height() * scaleY,
            node.width() * scaleX,
            0,
          ],
          closed: true,

          // set minimal value
          width: Math.max(node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export default TriangleShape;
