import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Float, 
  ContactShadows, 
  Html, 
  RoundedBox
} from '@react-three/drei';

// --- Components ---

const MacStudio = () => {
  return (
    <group position={[-1.2, 0.05, 0.3]} rotation={[0, Math.PI / 6, 0]}>
      <RoundedBox args={[0.6, 0.25, 0.6]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Front LED */}
      <mesh position={[0, 0, 0.301]}>
        <planeGeometry args={[0.01, 0.01]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
    </group>
  );
};

const Monitor = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, 0.8, 0]}>
        {/* Main Display Body */}
        <RoundedBox args={[2.4, 1.4, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        
        {/* Silver Back/Bezel border */}
        <RoundedBox args={[2.42, 1.42, 0.05]} radius={0.06} smoothness={4} position={[0, 0, -0.03]}>
          <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Height Adjustable Arm */}
        <group position={[0, -0.7, -0.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Base Joint */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* The Screen / Terminal Content */}
        <Html
          transform
          distanceFactor={1.2}
          position={[0, 0, 0.051]}
          className="pointer-events-none select-none"
        >
          <div className="w-[800px] h-[450px] flex items-center justify-center overflow-hidden rounded-lg">
            {/* Terminal Window */}
            <div className="w-[500px] h-[300px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 relative flex flex-col font-mono">
              {/* Terminal Header */}
              <div className="flex gap-1.5 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <div className="ml-auto flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                   <span className="text-[10px] text-blue-400/50 uppercase tracking-widest">System Active</span>
                </div>
              </div>
              
              <div className="text-blue-400 text-sm mb-4">
                <span className="opacity-50">$</span> system.init(portfolio)
              </div>

              {/* Matrix-style Code Flow */}
              <div className="flex-1 overflow-hidden mask-fade-bottom">
                <div className="space-y-1 text-[10px] animate-matrix-flow">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-purple-300">func</span>
                      <span className="text-emerald-300">renderExperience()</span>
                      <span className="text-orange-200">{`{ status: "deploying" }`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cursor */}
              <div className="mt-2 w-2 h-4 bg-blue-400/50 animate-bounce" />
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={35} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[5, 10, 5]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#cbd5e1" />
      
      {/* Background Props (Blurred/Lifestyle) */}
      <group position={[2, 0.2, -2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Coffee Mug Representation */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
      </group>

      <group position={[-2.5, 0.5, -3]}>
        {/* Monstera Leaf Representation (Abstract) */}
        <mesh rotation={[0.4, 0.5, 0]}>
          <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, 0.5]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
      </group>

      {/* Main Subjects */}
      <Monitor />
      <MacStudio />

      {/* Desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} metalness={0.1} />
      </mesh>

      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={1} 
        resolution={256} 
        color="#000000" 
      />
      
      <Environment preset="city" />
    </>
  );
};

// --- Main Component ---

const HeroVisual: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroVisual;
