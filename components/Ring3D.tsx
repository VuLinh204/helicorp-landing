"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

function RingModel({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Xoay nhẹ nhàng nhẫn theo thời gian
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float
      speed={2.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5} 
      floatingRange={[-0.1, 0.1]}
    >
      {/* 
        scale={[1, 1, 0.35]} giúp bóp dẹt khối Torus (Donut) ở trục Z 
        để tạo ra hình dáng bản nhẫn thông minh (phẳng và rộng ngang) giống hệt đời thực.
      */}
      <mesh ref={meshRef} castShadow receiveShadow scale={[1, 1, 0.35]}>
        <torusGeometry args={[2.6, 0.9, 32, 64]} />
        <meshPhysicalMaterial 
          color={isDark ? "#111827" : "#0F172A"} // Màu đen/titan tối giống nhẫn Oura/Aura
          metalness={1} 
          roughness={0.15} 
          envMapIntensity={isDark ? 2.5 : 3.5} 
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export function Ring3D() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      {/* Hiệu ứng loading mờ phía sau */}
      {!isLoaded && (
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
      )}
      
      <Canvas 
        shadows 
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 45 }}
        onCreated={() => setIsLoaded(true)}
      >
        <ambientLight intensity={isDark ? 0.3 : 0.6} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 
          OrbitControls thay cho PresentationControls:
          - Đảm bảo nhẫn luôn ở giữa khung hình, KHÔNG BAO GIỜ bị văng mất khi vuốt mạnh.
          - enableZoom=false, enablePan=false để khóa vị trí, chỉ cho xoay.
        */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableDamping 
          dampingFactor={0.05}
          autoRotate={false}
        />

        {/* Hiển thị chiếc nhẫn */}
        <RingModel isDark={isDark} />

        {/* Môi trường phản chiếu cao cấp */}
        <Environment preset={isDark ? "city" : "studio"} resolution={256} />
        
        {/* Bóng đổ chân thực dưới đáy (Bake 1 lần để tối ưu hiệu năng) */}
        <ContactShadows 
          position={[0, -3.8, 0]} 
          opacity={isDark ? 0.6 : 0.3} 
          scale={12} 
          blur={2.5} 
          far={5} 
          color="#000000"
          resolution={256}
          frames={1}
        />
      </Canvas>
    </div>
  );
}
