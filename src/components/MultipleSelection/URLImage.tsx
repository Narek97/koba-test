import { FC, useRef } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

interface IURLImage {
  image: any;
  onDragEnd: any;
  id: any;
}

const URLImage: FC<IURLImage> = ({ image, onDragEnd, id }) => {
  const [img] = useImage(image.src);
  const imgRef = useRef<any>();
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      ref={imgRef}
      draggable
      id={id}
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
