import { FC, useRef } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

interface IURLImage {
  image: any;
  setImages: any;
}

const URLImage: FC<IURLImage> = ({ image, setImages }) => {
  const [img] = useImage(image.src);
  const imgRef = useRef<any>();
  const onDragEnd = () => {
    if (imgRef.current) {
      setImages((prev: any) =>
        prev.map((el: any, index: any) => {
          if (el.id === image.id) {
            el = {
              ...image,
              x: imgRef.current.x(),
              y: imgRef.current.y(),
            };
          }
          return el;
        })
      );
    }
  };

  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      ref={imgRef}
      draggable
      id={image.id}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      onDragEnd={onDragEnd}
      name={"icon"}
      // TODO: onSelect={onSelect}
    />
  );
};

export default URLImage;
