"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 120;
const CONNECTION_DISTANCE = 1.8;
const SPHERE_RADIUS = 3.5;

function fibonacciSphere(count, radius) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

function PlexusNetwork({ mouse }) {
  const groupRef = useRef();
  const nodesRef = useRef();
  const linesRef = useRef();
  const { size } = useThree();

  const basePositions = useMemo(() => fibonacciSphere(NODE_COUNT, SPHERE_RADIUS), []);

  const { nodeGeometry, nodePositionsArray } = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3);
    basePositions.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { nodeGeometry: geometry, nodePositionsArray: positions };
  }, [basePositions]);

  const { lineGeometry, maxSegments } = useMemo(() => {
    let count = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (basePositions[i].distanceTo(basePositions[j]) < CONNECTION_DISTANCE) count++;
      }
    }
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { lineGeometry: geometry, maxSegments: count };
  }, [basePositions]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Mouse-driven tilt
    const targetRotX = mouse.current.y * 0.35;
    const targetRotY = mouse.current.x * 0.5;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY + t * 0.08 - groupRef.current.rotation.y) * 0.05;

    // Pulse nodes
    const nodePositions = nodesRef.current?.geometry.attributes.position;
    if (nodePositions) {
      basePositions.forEach((base, i) => {
        const wave = Math.sin(t * 1.2 + i * 0.4) * 0.12;
        const scale = 1 + wave;
        nodePositions.setXYZ(i, base.x * scale, base.y * scale, base.z * scale);
      });
      nodePositions.needsUpdate = true;
    }

    // Update line positions & colors
    const linePos = linesRef.current?.geometry.attributes.position;
    const lineCol = linesRef.current?.geometry.attributes.color;
    if (linePos && lineCol) {
      let idx = 0;
      const currentPositions = nodePositions
        ? Array.from({ length: NODE_COUNT }, (_, i) =>
            new THREE.Vector3(
              nodePositions.getX(i),
              nodePositions.getY(i),
              nodePositions.getZ(i)
            )
          )
        : basePositions;

      for (let i = 0; i < NODE_COUNT && idx < maxSegments; i++) {
        for (let j = i + 1; j < NODE_COUNT && idx < maxSegments; j++) {
          const dist = currentPositions[i].distanceTo(currentPositions[j]);
          if (dist < CONNECTION_DISTANCE) {
            linePos.setXYZ(idx * 2, currentPositions[i].x, currentPositions[i].y, currentPositions[i].z);
            linePos.setXYZ(idx * 2 + 1, currentPositions[j].x, currentPositions[j].y, currentPositions[j].z);

            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const pulse = 0.5 + 0.5 * Math.sin(t * 2.0 + i * 0.3);
            const brightness = alpha * (0.6 + 0.4 * pulse);

            // Neon blue-cyan gradient
            const r = 0.0 + 0.1 * brightness;
            const g = 0.5 * brightness + 0.2 * pulse;
            const b = 1.0 * brightness;

            lineCol.setXYZ(idx * 2, r, g, b);
            lineCol.setXYZ(idx * 2 + 1, r * 0.6, g * 0.8, b * 0.9);
            idx++;
          }
        }
      }
      linePos.needsUpdate = true;
      lineCol.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, idx * 2);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial vertexColors transparent opacity={0.75} />
      </lineSegments>

      {/* Nodes */}
      <points ref={nodesRef} geometry={nodeGeometry} frustumCulled={false}>
        <pointsMaterial
          color="#00d4ff"
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>

      {/* Glow orb at center */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color="#80dfff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef();
  const count = 60;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = 0;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] += velocities[i * 3];
      pos.array[i * 3 + 1] += velocities[i * 3 + 1];
      if (Math.abs(pos.array[i * 3]) > 10) velocities[i * 3] *= -1;
      if (Math.abs(pos.array[i * 3 + 1]) > 6) velocities[i * 3 + 1] *= -1;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#1a6aff" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#0066ff" />
      <pointLight position={[-5, -3, -3]} intensity={0.3} color="#00ffcc" />
      <PlexusNetwork mouse={mouse} />
      <FloatingParticles />
    </>
  );
}

export default function PlexusSphere() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
