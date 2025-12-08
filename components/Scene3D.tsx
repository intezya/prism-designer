import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Stars, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SceneConfig, ShapeType, MaterialType } from '../types';

interface Scene3DProps {
  config: SceneConfig;
  scrollProgress: React.MutableRefObject<number>;
}

const AnimatedMesh: React.FC<{ config: SceneConfig; scrollProgress: React.MutableRefObject<number> }> = ({ config, scrollProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Track smoothed scroll position for fluid animation
  const smoothedScroll = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScroll = scrollProgress.current;

      // Smoother damping (lower lambda = more weight/inertia)
      // Reduced from 4 to 2.5 to make transitions feel heavier and smoother
      smoothedScroll.current = THREE.MathUtils.damp(smoothedScroll.current, targetScroll, 1.5, delta);
      const p = smoothedScroll.current;

      // Calculate velocity for subtle tilt (dampened)
      const velocity = (targetScroll - p);

      // 1. Rotation Logic - FIXED
      // Previously accumulative (+=) which caused spinning out of control.
      // Now using absolute calculation: Time (constant spin) + Scroll (interactive spin).
      const time = state.clock.getElapsedTime();

      // Base rotation from time
      const baseRotX = time * config.rotationSpeed * 0.2;
      const baseRotY = time * config.rotationSpeed;

      // Scroll-based rotation (Mapped directly to scroll position)
      // 1 full scroll = 2 full rotations (4PI)
      const scrollRotY = p * Math.PI * 4;

      meshRef.current.rotation.x = baseRotX;
      meshRef.current.rotation.y = baseRotY + scrollRotY;

      // Dynamic tilt (Reduced intensity to stop "jumping")
      meshRef.current.rotation.z = -velocity * 0.5;

      // 2. Scale Logic - FIXED
      // Removed velocity-based scale pulsing which looked like bouncing
      meshRef.current.scale.setScalar(config.scale);

      // 3. Position Logic (Paths)
      // Page 1 (0.0): Right side [3, 0, 0]
      // Page 2 (0.5): Left side [-3, 0, 0]
      // Page 3 (1.0): Center [0, 0, 0]

      const positions = [
        new THREE.Vector3(2.5, -0.5, 0),
        new THREE.Vector3(-2.5, -0.5, 0),
        new THREE.Vector3(0, -0.5, 0)
      ];

      const curve = new THREE.CatmullRomCurve3(positions, false, 'catmullrom', 0.5);
      const point = curve.getPointAt(p);

      const wave = Math.sin(p * Math.PI * 4) * 0.3;
      const arc = Math.sin(p * Math.PI) * 1.5;

      meshRef.current.position.set(
          point.x,
          point.y + wave,
          arc
      );
  }});

  const getGeometry = () => {
    switch (config.shape) {
      case ShapeType.Box: return <boxGeometry args={[1, 1, 1]} />;
      case ShapeType.Torus: return <torusGeometry args={[0.7, 0.3, 16, 100]} />;
      case ShapeType.Knot: return <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />;
      case ShapeType.Octahedron: return <octahedronGeometry args={[1]} />;
      case ShapeType.Icosahedron: default: return <icosahedronGeometry args={[1, 0]} />;
    }
  };

  const renderMaterial = () => {
    if (config.material === MaterialType.Wireframe) {
      return (
        <meshStandardMaterial 
          color={config.color} 
          wireframe 
          emissive={config.color}
          emissiveIntensity={0.5}
        />
      );
    }
    
    if (config.material === MaterialType.Physical) {
       return (
        <MeshTransmissionMaterial 
            backside
            backsideThickness={1}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.1}
            color={config.color}
            metalness={config.metalness}
            roughness={config.roughness}
        />
       )
    }

    return (
      <meshStandardMaterial
        color={config.color}
        metalness={config.metalness}
        roughness={config.roughness}
      />
    );
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {getGeometry()}
        {renderMaterial()}
      </mesh>
    </Float>
  );
};

const Scene3D: React.FC<Scene3DProps> = ({ config, scrollProgress }) => {
  return (
    <div className="w-full h-full relative" style={{ backgroundColor: config.bgColor, transition: 'background-color 1s ease' }}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={[config.bgColor, 5, 25]} />
        
        {/* Dynamic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={config.lightIntensity}
          color={config.lightColor}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={config.lightIntensity * 0.5} color={config.color} />

        {/* Environment Reflections */}
        <Environment preset="city" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <AnimatedMesh config={config} scrollProgress={scrollProgress} />

        <ContactShadows
          resolution={1024}
          scale={10}
          blur={2.5}
          opacity={0.5}
          far={10}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
