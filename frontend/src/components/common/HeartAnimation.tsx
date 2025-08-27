import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';

// Heart model component
const Heart = () => {
  const { theme } = useTheme();
  const heartRef = useRef<any>();
  
  // This is a placeholder for loading a 3D heart model
  // In a real app, you would use useGLTF to load an actual heart model
  useFrame((state) => {
    if (heartRef.current) {
      // Simulate heartbeat effect
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 1.2) * 0.05;
      heartRef.current.scale.set(scale, scale, scale);
      
      // Slow rotation
      heartRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={heartRef}>
      {/* Placeholder heart made of simple geometry */}
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#f43f5e' : '#ef4444'} 
          emissive={theme === 'dark' ? '#450a0a' : '#fef2f2'}
          emissiveIntensity={0.3}
          metalness={0.1} 
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0.8, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#f43f5e' : '#ef4444'} 
          emissive={theme === 'dark' ? '#450a0a' : '#fef2f2'}
          emissiveIntensity={0.3}
          metalness={0.1} 
          roughness={0.7}
        />
      </mesh>
      <mesh position={[-0.8, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#f43f5e' : '#ef4444'} 
          emissive={theme === 'dark' ? '#450a0a' : '#fef2f2'}
          emissiveIntensity={0.3}
          metalness={0.1} 
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// Scene setup with lighting
const HeartScene = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={theme === 'dark' ? 1 : 2} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <directionalLight 
        position={[-10, -10, -5]} 
        intensity={theme === 'dark' ? 0.2 : 0.5} 
        color={theme === 'dark' ? '#3b82f6' : '#60a5fa'} 
      />
      <Heart />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
      />
    </>
  );
};

// Main component with Canvas
const HeartAnimation = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
      >
        <HeartScene />
      </Canvas>
    </div>
  );
};

export default HeartAnimation;