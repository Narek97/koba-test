import React, { FC, useRef } from "react";
import { KonvaNodeComponent, Rect } from "react-konva";
import Konva from "konva";
import TRect = Konva.Rect;

interface IRoundedSquare {
  shapeProps: any;
  onSelect: any;
  onChange: any;
}

const RoundedSquare: FC<IRoundedSquare> = ({
  shapeProps,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<KonvaNodeComponent<TRect>>(null);
  return (
    <Rect
      onClick={() => onSelect(shapeRef)}
      onTap={() => onSelect(shapeRef)}
      // ref={shapeRef.current[getKey]}
      ref={shapeRef}
      {...shapeProps}
      dash={[10, 10]}
      name="roundRect"
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
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export default RoundedSquare;
