import React, { FC, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

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
  const shapeRef = useRef<any>();

  return (
    <Rect
      onClick={() => onSelect(shapeRef)}
      onTap={() => onSelect(shapeRef)}
      // ref={shapeRef.current[getKey]}
      ref={shapeRef}
      {...shapeProps}
      name="rectangle"
      draggable
      onDragEnd={(e: any) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e: any) => {
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
  );
};

const Page4 = () => {
  const [selectedId, selectShape] = useState<any>(null);

  const [annotations, setAnnotations] = useState<any>([]);
  const [newAnnotation, setNewAnnotation] = useState<any>([]);
  const [selectedElement, setSelectedElement] = useState("");

  const [nodesArray, setNodes] = useState<any>([]);
  const trRef = useRef<any>();
  const layerRef = useRef<any>();

  const selectionRectRef = useRef<any>();
  const selection = useRef<any>({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  // const Konva = window.Konva;

  const onAddElement = (type: string) => {
    setSelectedElement((prev) => (prev === type ? "" : type));
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      trRef.current.nodes([]);
      setNodes([]);
      // layerRef.current.remove(selectionRectangle);
    }
    if (selectedElement !== "draw") {
      setSelectedElement("");
    }
  };

  const handleMouseDown = (e: any) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    if (newAnnotation.length === 0 && selectedElement === "rect") {
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
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
  };
  const handleTouchStart = (e: any) => {};

  const annotationsToDraw = [...annotations, ...newAnnotation];

  return (
    <div>
      <div className={"header"}>
        <button onClick={() => onAddElement("rect")}>Rectangle</button>
      </div>
      <div>
        <Stage
          width={window.innerWidth - 100}
          height={window.innerHeight - 140}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          className={`board ${selectedElement}`}
        >
          <Layer>
            {annotationsToDraw.map((rect: any, i: any) => {
              return (
                <Rectangle
                  key={i}
                  shapeProps={{ ...rect, stroke: "black" }}
                  isSelected={rect.id === selectedId}
                  onSelect={(e: any) => {
                    if (e.current !== undefined) {
                      let temp = nodesArray;
                      if (!nodesArray.includes(e.current)) temp.push(e.current);
                      setNodes(temp);
                      trRef.current.nodes(nodesArray);
                      trRef.current.nodes(nodesArray);
                      trRef.current.getLayer().batchDraw();
                    }
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs: any) => {
                    const rects = annotations.slice();
                    rects[i] = newAttrs;
                    setAnnotations(rects);
                    // console.log(rects)
                  }}
                />
              );
            })}
            <Transformer
              // ref={trRef.current[getKey]}
              ref={trRef}
              boundBoxFunc={(oldBox: any, newBox: any) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
            <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Page4;
