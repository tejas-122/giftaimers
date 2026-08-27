import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, RoundedBox } from "@react-three/drei";

/**
 * The signature moment of GiftAimers: a floating gift box that slowly rotates,
 * and whose ribbon "unties" (lid lifts) on hover/click, symbolizing personalization
 * being revealed. Kept low-poly & lightweight so it performs well on mobile.
 */
function Ribbon({ color = "#D6217F" }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.32, 2.02, 2.02]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.32, 2.02, 2.02]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Box({ opened }) {
  const lidRef = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
    if (lidRef.current) {
      const target = opened ? 1.1 : 0;
      lidRef.current.position.y += (target - lidRef.current.position.y) * 0.08;
      lidRef.current.rotation.z += ((opened ? -0.35 : 0) - lidRef.current.rotation.z) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Box base */}
      <RoundedBox args={[2, 1.6, 2]} radius={0.08} smoothness={4} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#3D1E6B" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      <group position={[0, -0.5, 0]}>
        <Ribbon />
      </group>

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.35, 0]}>
        <RoundedBox args={[2.15, 0.4, 2.15]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#3D1E6B" roughness={0.5} metalness={0.15} />
        </RoundedBox>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.32, 0.32, 2.2]} />
          <meshStandardMaterial color="#D6217F" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Bow */}
        <mesh position={[-0.28, 0.35, 0]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.22, 0.07, 12, 24]} />
          <meshStandardMaterial color="#D6217F" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0.28, 0.35, 0]} rotation={[0, 0, -0.5]}>
          <torusGeometry args={[0.22, 0.07, 12, 24]} />
          <meshStandardMaterial color="#D6217F" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export default function GiftBoxHero() {
  const [opened, setOpened] = useState(false);

  return (
    <div
      className="w-full h-[380px] md:h-[460px] cursor-pointer"
      onClick={() => setOpened((o) => !o)}
      role="button"
      aria-label="Click to unwrap the gift"
      title="Click to unwrap"
    >
      <Canvas camera={{ position: [3, 2, 4], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 3]} intensity={1.2} />
        <pointLight position={[-4, -2, -3]} intensity={0.3} color="#D6217F" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
          <Box opened={opened} />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
