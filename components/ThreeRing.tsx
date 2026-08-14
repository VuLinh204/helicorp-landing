"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

export default function ThreeRing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Track pointer state
  const isDragging = useRef(false);
  const hasInteracted = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.4, y: -0.5 }); // Initial attractive tilt
  const currentRotation = useRef({ x: 0.4, y: -0.5 });
  
  // Material reference to update color when theme changes
  const ringMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    dir: THREE.DirectionalLight;
    pointBlue: THREE.PointLight;
    pointCyan: THREE.PointLight;
  } | null>(null);

  // Update material and lighting based on theme change
  useEffect(() => {
    const isDark = theme === "dark";
    if (ringMaterialRef.current) {
      ringMaterialRef.current.color.setHex(isDark ? 0x242830 : 0xe2e8f0);
      ringMaterialRef.current.roughness = isDark ? 0.18 : 0.12;
      ringMaterialRef.current.needsUpdate = true;
    }
    if (lightsRef.current) {
      const { ambient, dir, pointBlue, pointCyan } = lightsRef.current;
      if (isDark) {
        ambient.color.setHex(0x0a1628);
        ambient.intensity = 0.4;
        dir.color.setHex(0xffffff);
        dir.intensity = 2.5;
        pointBlue.color.setHex(0x6366f1);
        pointBlue.intensity = 8.0;
        pointCyan.color.setHex(0x06b6d4);
        pointCyan.intensity = 6.0;
      } else {
        ambient.color.setHex(0xffffff);
        ambient.intensity = 0.8;
        dir.color.setHex(0xffffff);
        dir.intensity = 2.0;
        pointBlue.color.setHex(0xa5b4fc);
        pointBlue.intensity = 4.0;
        pointCyan.color.setHex(0x67e8f9);
        pointCyan.intensity = 3.0;
      }
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. SETUP RENDERER & SCENE ---
    const scene = new THREE.Scene();
    
    // Transparent background so CSS mesh-bg and gradients shine through
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false; // Disable for performance
    
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    // --- 2. LIGHTING ---
    const isDark = theme === "dark";
    
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x0a1628 : 0xffffff,
      isDark ? 0.4 : 0.8
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      0xffffff,
      isDark ? 2.5 : 2.0
    );
    dirLight.position.set(5, 5, 4);
    scene.add(dirLight);

    // Colored accent lights to give stunning reflections
    const pointLightBlue = new THREE.PointLight(
      isDark ? 0x6366f1 : 0xa5b4fc,
      isDark ? 8.0 : 4.0,
      15
    );
    pointLightBlue.position.set(-3, 2, 2);
    scene.add(pointLightBlue);

    const pointLightCyan = new THREE.PointLight(
      isDark ? 0x06b6d4 : 0x67e8f9,
      isDark ? 6.0 : 3.0,
      15
    );
    pointLightCyan.position.set(3, -2, 2);
    scene.add(pointLightCyan);

    // Moving spotlight that orbits the ring to create sweeping specular highlights
    const orbitLight = new THREE.PointLight(0xffffff, 3.0, 10);
    orbitLight.position.set(0, 0, 4);
    scene.add(orbitLight);

    lightsRef.current = {
      ambient: ambientLight,
      dir: dirLight,
      pointBlue: pointLightBlue,
      pointCyan: pointLightCyan,
    };

    // --- 3. PROCEDURAL BRUSHED METAL TEXTURE ---
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 256;
    texCanvas.height = 256;
    const texCtx = texCanvas.getContext("2d");
    if (texCtx) {
      texCtx.fillStyle = "#ffffff";
      texCtx.fillRect(0, 0, 256, 256);
      texCtx.fillStyle = "rgba(0,0,0,0.12)";
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const len = Math.random() * 60 + 15;
        texCtx.fillRect(x, y, len, 1);
      }
    }
    const roughnessMap = new THREE.CanvasTexture(texCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(8, 2);

    // --- 4. RINGS GEOMETRY & MATERIALS ---
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Create Comfort Fit Band using LatheGeometry (flat outside, rounded bevels, thickness)
    const profilePoints = [];
    const rInner = 1.35;
    const rOuter = 1.55;
    const height = 0.45;
    const bevel = 0.04;

    // Profile coordinates (X is radius, Y is height)
    profilePoints.push(new THREE.Vector2(rInner, -height / 2));                             // Inner bottom
    profilePoints.push(new THREE.Vector2(rOuter - bevel, -height / 2));                      // Outer bottom bevel start
    profilePoints.push(new THREE.Vector2(rOuter, -height / 2 + bevel));                      // Outer bottom bevel end
    profilePoints.push(new THREE.Vector2(rOuter, height / 2 - bevel));                       // Outer top bevel start
    profilePoints.push(new THREE.Vector2(rOuter - bevel, height / 2));                       // Outer top bevel end
    profilePoints.push(new THREE.Vector2(rInner, height / 2));                              // Inner top
    profilePoints.push(new THREE.Vector2(rInner, -height / 2));                             // Close profile loop

    const ringGeometry = new THREE.LatheGeometry(profilePoints, 64);
    
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x242830 : 0xe2e8f0,
      metalness: 0.95,
      roughness: isDark ? 0.18 : 0.12,
      roughnessMap: roughnessMap,
    });
    ringMaterialRef.current = ringMaterial;

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringGroup.add(ringMesh);

    // --- 5. INNER GLASS LINER FOR SENSORS ---
    const linerGeometry = new THREE.CylinderGeometry(
      rInner + 0.005,
      rInner + 0.005,
      height - 0.01,
      64,
      1,
      true
    );
    const linerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const linerMesh = new THREE.Mesh(linerGeometry, linerMaterial);
    ringGroup.add(linerMesh);

    // --- 6. SENSORS (PPG LEDS & PHOTODETECTOR) ---
    // Standard smart rings have 3 interior sensor nodes (usually at the bottom finger rest)
    const sensorAngles = [
      Math.PI * 0.9,    // Left sensor
      Math.PI * 1.0,    // Center sensor
      Math.PI * 1.1,    // Right sensor
    ];

    const sensorGroup = new THREE.Group();
    ringGroup.add(sensorGroup);

    const leds: { mesh: THREE.Mesh; material: THREE.MeshStandardMaterial; type: "green" | "red" }[] = [];

    sensorAngles.forEach((angle, idx) => {
      // Sensor housing base
      const baseGeometry = new THREE.BoxGeometry(0.12, 0.16, 0.04);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x0c0f16,
        roughness: 0.6,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
      
      // Position base on inner wall
      const baseRadius = rInner + 0.01;
      baseMesh.position.set(
        Math.sin(angle) * baseRadius,
        0,
        Math.cos(angle) * baseRadius
      );
      // Align rotation to face center
      baseMesh.rotation.y = angle + Math.PI;
      sensorGroup.add(baseMesh);

      // Embedded LED lens
      const ledGeometry = new THREE.SphereGeometry(0.022, 16, 16);
      const isCenter = idx === 1;
      const ledColor = isCenter ? 0xef4444 : 0x10b981; // Center is Infrared/Red, sides are Green
      
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: ledColor,
        emissive: ledColor,
        emissiveIntensity: 2.0,
        roughness: 0.1,
      });

      const ledMesh = new THREE.Mesh(ledGeometry, ledMaterial);
      // Position slightly protruding from housing base
      ledMesh.position.set(
        Math.sin(angle) * (rInner - 0.01),
        0,
        Math.cos(angle) * (rInner - 0.01)
      );
      sensorGroup.add(ledMesh);

      leds.push({
        mesh: ledMesh,
        material: ledMaterial,
        type: isCenter ? "red" : "green",
      });
    });

    // --- 7. POINTER INTERACTION ---
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      hasInteracted.current = true;
      previousPointerPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
      // Prevent selection
      e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - previousPointerPosition.current.x;
      const deltaY = e.clientY - previousPointerPosition.current.y;
      
      targetRotation.current.y += deltaX * 0.007;
      targetRotation.current.x += deltaY * 0.007;



      previousPointerPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // --- 8. RESPONSIVE SIZING ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    // --- 9. ANIMATION LOOP ---
    let animationId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Orbiting light rotation for sweeping specular glints
      orbitLight.position.x = Math.sin(time * 0.7) * 4.5;
      orbitLight.position.y = Math.cos(time * 0.5) * 1.5;
      orbitLight.position.z = Math.cos(time * 0.7) * 4.5;

      // Pulse LED emissive intensity to simulate real optical heart-rate scanning
      leds.forEach((led) => {
        if (led.type === "green") {
          led.material.emissiveIntensity = 2.0 + Math.sin(time * 8.0) * 1.2;
        } else {
          led.material.emissiveIntensity = 1.5 + Math.sin(time * 4.0) * 0.6;
        }
      });

      // Ambient/Auto rotation when not dragging and user has not interacted yet
      if (!isDragging.current && !hasInteracted.current) {
        // Continuous rotation around Y
        targetRotation.current.y += 0.0035;
        // Natural organic float/wobble on X
        targetRotation.current.x = 0.35 + Math.sin(time * 0.4) * 0.12;
      }

      // Smooth interpolation (lerp) for fluid lag-free movements
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      ringGroup.rotation.x = currentRotation.current.x;
      ringGroup.rotation.y = currentRotation.current.y;

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. CLEANUP ---
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Memory cleanup
      scene.remove(ringGroup);
      ringGeometry.dispose();
      ringMaterial.dispose();
      linerGeometry.dispose();
      linerMaterial.dispose();
      roughnessMap.dispose();
      
      sensorGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on client mount

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ minHeight: "inherit" }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block outline-none touch-pan-y"
      />
    </div>
  );
}
