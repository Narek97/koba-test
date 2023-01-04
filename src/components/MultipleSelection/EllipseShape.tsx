import React, { FC, useRef } from "react";
import { Ellipse, KonvaNodeComponent } from "react-konva";
import Konva from "konva";
import TRect = Konva.Rect;

interface IEllipseShape {
  shapeProps: any;
  onSelect: any;
  onChange: any;
}

const EllipseShape: FC<IEllipseShape> = ({
  shapeProps,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<KonvaNodeComponent<TRect>>(null);
  return (
    <Ellipse
      onClick={() => onSelect(shapeRef)}
      onTap={() => onSelect(shapeRef)}
      // ref={shapeRef.current[getKey]}
      ref={shapeRef}
      {...shapeProps}
      dash={[10, 10]}
      name="ellipse"
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
          radiusX: Math.abs(node.radiusX()),
          radiusY: Math.abs(node.radiusY()),
          // set minimal value
          width: Math.max(node.radiusX() * scaleX),
          height: Math.max(node.radiusY() * scaleY),
        });
      }}
    />
  );
};

export default EllipseShape;
