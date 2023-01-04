import React, { FC, useEffect, useRef, useState } from "react";
import {
  Circle,
  Ellipse,
  Layer,
  Line,
  Rect,
  RegularPolygon,
  Shape,
  Stage,
  Star,
  Transformer,
  Wedge,
} from "react-konva";

interface IRectangle {
  shapeProps: any;
  isSelected: any;
  onSelect: any;
  onChange: any;
}

const Rectangle: FC<IRectangle> = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
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
          const node = shapeRef.current;
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
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const Page3 = () => {
  const [selectedId, selectShape] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState("");

  // draw
  const isDrawing = useRef(false);
  const [lines, setLines] = useState<any>([]);
  //

  // rect
  const [annotations, setAnnotations] = useState<any>([]);
  const [newAnnotation, setNewAnnotation] = useState<any>([]);
  //

  // circle
  const [annotations2, setAnnotations2] = useState<any>([]);
  const [newAnnotation2, setNewAnnotation2] = useState<any>([]);
  //

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
    if (selectedElement !== "draw") {
      setSelectedElement("");
    }
  };

  const onAddElement = (type: string) => {
    setSelectedElement((prev) => (prev === type ? "" : type));
  };

  // const addNewElement = (e: any) => {
  //   const pos = e.target.getStage().getPointerPosition();
  //   if (selectedElement === "rect") {
  //     const id = new Date().getMilliseconds().toString();
  //     setRectangles([
  //       ...rectangles,
  //       {
  //         x: pos.x,
  //         y: pos.y,
  //         width: 100,
  //         height: 100,
  //         fill: "green",
  //         id,
  //       },
  //     ]);
  //     setSelectedElement("");
  //     selectShape(id);
  //   }
  // };

  const handleMouseDown = (e: any) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    if (newAnnotation.length === 0 && selectedElement === "rect") {
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
    }

    if (selectedElement === "draw") {
      isDrawing.current = true;
      setLines([...lines, { points: [x, y] }]);
    }
  };

  const handleMouseUp = (e: any) => {
    checkDeselect(e);

    if (newAnnotation.length === 1 && selectedElement === "rect") {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = e.target.getStage().getPointerPosition();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1,
        fill: "green",
        id: new Date().toLocaleTimeString().toString(),
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
    }
    if (selectedElement === "draw") {
      isDrawing.current = false;
    }
  };

  const handleMouseMove = (e: any) => {
    if (newAnnotation.length === 1 && selectedElement === "rect") {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = e.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: "0",
        },
      ]);
    }

    if (selectedElement === "draw") {
      // no drawing - skipping
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];

  return (
    <>
      <div className={"header"}>
        <button onClick={() => onAddElement("draw")}>Paint</button>
        <button onClick={() => onAddElement("rect")}>Rectangle</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={checkDeselect}
        className={`board ${selectedElement}`}
      >
        <Layer>
          {lines.map((line: any, i: any) => (
            <Line
              draggable
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}

          {/*{annotationsToDraw.map((rect: any, i: any) => {*/}
          {/*  return (*/}
          {/*    <RectangleShape*/}
          {/*      key={i}*/}
          {/*      shapeProps={{ ...rect, stroke: "black" }}*/}
          {/*      isSelected={rect.id === selectedId}*/}
          {/*      onSelect={() => {*/}
          {/*        selectShape(rect.id);*/}
          {/*      }}*/}
          {/*      onChange={(newAttrs: any) => {*/}
          {/*        const rects = annotations.slice();*/}
          {/*        rects[i] = newAttrs;*/}
          {/*        setAnnotations(rects);*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}

          {/*{annotationsToDraw.map((value: any, i: any) => {*/}
          {/*  return (*/}
          {/*    <Ellipse*/}
          {/*      key={i}*/}
          {/*      x={value.x}*/}
          {/*      y={value.y}*/}
          {/*      radiusX={Math.abs(value.width)}*/}
          {/*      radiusY={Math.abs(value.height)}*/}
          {/*      fill="transparent"*/}
          {/*      stroke="black"*/}
          {/*      strokeWidth={2}*/}
          {/*      dash={[10, 10]}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}

          {/*{annotationsToDraw.map((value: any, i: any) => {*/}
          {/*  return (*/}
          {/*    <Rect*/}
          {/*      key={i}*/}
          {/*      x={value.x}*/}
          {/*      y={value.y}*/}
          {/*      width={Math.abs(value.width)}*/}
          {/*      height={Math.abs(value.height)}*/}
          {/*      cornerRadius={10}*/}
          {/*      fill="transparent"*/}
          {/*      stroke="black"*/}
          {/*      strokeWidth={2}*/}
          {/*      dash={[10, 10]}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}

          {/*{annotationsToDraw.map((value: any, i: any) => {*/}
          {/*  return (*/}
          {/*    <Line*/}
          {/*      key={i}*/}
          {/*      x={value.x}*/}
          {/*      y={value.y}*/}
          {/*      points={[0, 0, value.width / 2, value.height, value.width, 0]}*/}
          {/*      closed*/}
          {/*      fill="transparent"*/}
          {/*      stroke="black"*/}
          {/*      strokeWidth={2}*/}
          {/*      dash={[10, 10]}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}

          {/*{annotationsToDraw.map((value: any, i: any) => {*/}
          {/*  return (*/}
          {/*    <Star*/}
          {/*      key={i}*/}
          {/*      x={value.x}*/}
          {/*      y={value.y}*/}
          {/*      numPoints={5}*/}
          {/*      innerRadius={value.width}*/}
          {/*      outerRadius={value.width / 2}*/}
          {/*      rotation={value.width > 0 ? -180 : 0}*/}
          {/*      fill="transparent"*/}
          {/*      stroke="black"*/}
          {/*      strokeWidth={2}*/}
          {/*      dash={[10, 10]}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}
        </Layer>
      </Stage>
    </>
  );
};

export default Page3;
