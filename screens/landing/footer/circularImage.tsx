import { useEffect, useRef } from "react";

interface CircularImageProps {
  images: string[];
}

const CircularImage: React.FC<CircularImageProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const radius = 550; // Radius in pixels for the circular path
    const rotationSpeed = 0.005; // Rotation speed for the animation
    let angleOffset = 0;

    const animate = () => {
      const elements = containerRef.current
        ?.children as HTMLCollectionOf<HTMLImageElement>;

      if (elements) {
        Array.from(elements).forEach((image, index) => {
          const angle = (index / images.length) * (2 * Math.PI) + angleOffset;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          image.style.transform = `translate(${x}px, ${y}px)`;
        });
      }
      angleOffset += rotationSpeed;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current); // Correctly cancel the animation
      }
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "end",
      }}
      className="-mt-[0rem] max-xl:mt-20 max-2xl:mt-24"
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Icon ${index + 1}`}
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
};

export default CircularImage;
