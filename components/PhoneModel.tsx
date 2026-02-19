
/// <reference types="three" />
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import PhoneScreen from './PhoneScreen';

interface PhoneModelProps {
  onAppChange: (app: any) => void;
  activeSection: string;
  // canRotate: boolean;

}

const PhoneModel: React.FC<PhoneModelProps> = ({ onAppChange, activeSection }) => {
  // @ts-ignore - Handle missing group type in intrinsic elements
  const meshRef = useRef<THREE.Group>(null!);
  const [canRotate, setCanRotate] = useState(false);
const [isExpanded, setIsExpanded] = useState(false);


  // Minimal interaction: slightly follow mouse for depth perception, but no auto-float
  useFrame((state) => {
    if (!meshRef.current || !canRotate) return;
    // if (meshRef.current) {
      // Rotation follow is extremely subtle now
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        (state.mouse.x * Math.PI) / 12,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        (-state.mouse.y * Math.PI) / 12,
        0.05
      );
    // }
  });

  return (
    // @ts-ignore - group element type fix
    <group ref={meshRef} scale={0.7}>
      {/* Main Body (iPhone Frame) */}
      <RoundedBox
        args={[3.7, 7.5, 0.4]} // iPhone-like aspect ratio
        radius={0.35}
        smoothness={4}
      >
        <meshStandardMaterial color="#111" roughness={0.05} metalness={1} />
      </RoundedBox>

      {/* Screen Area (Inset) */}
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[3.45, 7.2]} />
        <meshBasicMaterial color="#000" />
      </mesh>

      {/* Dynamic Island Area */}
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[0, 3.2, 0.22]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Using primitive for capsuleGeometry to avoid missing intrinsic element type errors */}
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[0, 3.2, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <primitive object={new THREE.CapsuleGeometry(0.08, 0.4, 4, 16)} attach="geometry" />
        <meshBasicMaterial color="#000" />
      </mesh>

      {/* Screen Content */}
      <Html
        transform
        distanceFactor={4.5}
        position={[0, 0, 0.22]}
        occlude="blending"
        className="iphone-screen"
      >
        <div 
          className="w-[345px] h-[720px] bg-black rounded-[45px] overflow-hidden select-none"
          style={{ transform: 'scale(1)' }}
        >
          <PhoneScreen activeSection={activeSection} />
        </div>
      </Html>

      {/* Buttons (Stylized) */}
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[-1.9, 2.5, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[-1.9, 1.8, 0]}>
        <boxGeometry args={[0.05, 0.8, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* @ts-ignore - mesh element type fix */}
      <mesh position={[1.9, 1.8, 0]}>
        <boxGeometry args={[0.05, 1.0, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

export default PhoneModel;
