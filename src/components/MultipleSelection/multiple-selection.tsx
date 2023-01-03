import React, { useRef, useState } from "react";

import { Stage, Layer, Rect, Transformer } from "react-konva";
import Konva from "konva";
import Rectangle from "./Rectangle";

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

const initialRectangles = [
  {
    x: 150,
    y: 150,
    width: 80,
    height: 80,
    fill: "green",
    id: "rect2",
  },
  {
    x: 200,
    y: 200,
    width: 120,
    height: 120,
    fill: "green",
    id: "rect3",
  },
  {
    x: 300,
    y: 300,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect4",
  },
];

const MultipleSelection = () => {
  const [rectangles, setRectangles] = useState(initialRectangles);

  console.log(rectangles, "rectangles");
  // const [selectedId, selectShape] = useState<string>('');
  const trRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const selectionRectRef = useRef<any>(null);
  const selection = useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const Konva = window.Konva;
  console.log(Konva, 111);
  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      // // selectShape(null);
      trRef.current.nodes([]);
    }
  };
  const updateSelectionRect = () => {
    const node: any = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: "rgba(0, 161, 255, 0.3)",
    });
    node.getLayer().batchDraw();
  };

  const oldPos = useRef(null);
  const onMouseDown = (e: any) => {
    const isElement = e.target.findAncestor(".elements-container");
    const isTransformer = e.target.findAncestor("Transformer");
    if (isElement || isTransformer) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    selection.current.visible = true;
    selection.current.x1 = pos.x;
    selection.current.y1 = pos.y;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onMouseMove = (e: any) => {
    if (!selection.current.visible) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onMouseUp = () => {
    oldPos.current = null;
    if (!selection.current.visible) {
      return;
    }
    const selBox = selectionRectRef.current.getClientRect();

    const elements: any = [];
    layerRef.current.find(".rectangle").forEach((elementNode: any) => {
      const elBox = elementNode.getClientRect();
      if (Konva.Util.haveIntersection(selBox, elBox)) {
        elements.push(elementNode);
      }
    });
    trRef.current.nodes(elements);
    selection.current.visible = false;
    updateSelectionRect();
  };

  const onClickTap = (e: any) => {
    let stage = e.target.getStage();
    let layer = layerRef.current;
    let tr = trRef.current;
    if (e.target === stage) {
      // selectShape(null);
      tr.nodes([]);
      layer.draw();
      return;
    }

    if (!e.target.hasName(".rect")) {
      return;
    }

    // const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    // const isSelected = tr.nodes().indexOf(e.target) >= 0;
    // if (!metaPressed && !isSelected) {
    //   tr.nodes([e.target]);
    // } else if (metaPressed && isSelected) {
    //   const nodes = tr.nodes().slice();
    //   nodes.splice(nodes.indexOf(e.target), 1);
    //   tr.nodes(nodes);
    // } else if (metaPressed && !isSelected) {
    //   const nodes = tr.nodes().concat([e.target]);
    //   tr.nodes(nodes);
    // }
    // layer.draw();
  };

  return (
    <Stage
      width={window.innerWidth + 400}
      height={window.innerHeight + 400}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={checkDeselect}
      onClick={onClickTap}
    >
      <Layer ref={layerRef}>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              shapeProps={rect}
              onSelect={(e: any) => {
                if (e.current !== undefined) {
                  trRef.current.nodes([e.current]);
                  trRef.current.getLayer().batchDraw();
                }
                // selectShape(rect.id);
              }}
              onChange={(newAttrs: any) => {
                setRectangles((prev) =>
                  prev.map((el, index) => {
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

        <Transformer
          resizeEnabled={true}
          rotateEnabled={true}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
        <Rect fill="red" ref={selectionRectRef} />
      </Layer>
    </Stage>
  );
};

export default MultipleSelection;
