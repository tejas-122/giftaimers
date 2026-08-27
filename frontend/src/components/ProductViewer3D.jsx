import React, { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.4} />;
}

/**
 * If the product has a real .glb model (product.model3d), render an interactive
 * orbit-controlled 3D viewer. Otherwise, fall back to a tasteful tilt-on-drag
 * image gallery so every product still feels dimensional without requiring
 * a 3D artist to model every SKU.
 */
export default function ProductViewer3D({ model3d, images = [] }) {
  if (model3d) {
    return (
      <div className="w-full aspect-square bg-surface rounded-2xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <Model url={model3d} />
            </Stage>
          </Suspense>
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>
    );
  }
  return <TiltGallery images={images} />;
}

function TiltGallery({ images }) {
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef();

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * 10, y: px * -10 });
  };

  return (
    <div>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="w-full aspect-square bg-surface rounded-2xl overflow-hidden [perspective:1000px]"
      >
        <img
          src={images[active]}
          alt="Product"
          className="w-full h-full object-cover transition-transform duration-150 ease-out"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)` }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                i === active ? "border-gold" : "border-transparent opacity-70"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
