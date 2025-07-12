"use client"

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Field() {
  const fieldRef = useRef(null as any);
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });
  
  return (
    <group ref={fieldRef}>
      {/* Pelouse principale */}
      <mesh receiveShadow position={[0, -0.01, 0] as any} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[105, 68]} />
        <meshStandardMaterial
          color="#2d5a27"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Motifs de pelouse */}
      <GrassPattern />
      
      {/* Lignes de jeu */}
      <FieldLines />
      
      {/* Buts */}
      <Goal position={[-52.5, 0, 0]} />
      <Goal position={[52.5, 0, 0]} rotation={[0, Math.PI, 0]} />
      
      {/* Cercle central */}
      <CenterCircle />
      
      {/* Points de penalty */}
      <PenaltySpot position={[-40.5, 0.01, 0]} />
      <PenaltySpot position={[40.5, 0.01, 0]} />
    </group>
  );
}

function GrassPattern() {
  return (
    <group position={[0, 0.001, 0] as any}>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (i - 7) * 5] as any}>
          <planeGeometry args={[105, 4.8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#2d5a27" : "#326b2d"}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function FieldLines() {
  return (
    <group position={[0, 0.02, 0] as any}>
      {/* Ligne médiane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0] as any}>
        <planeGeometry args={[0.2, 68]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Contours terrain */}
      <mesh position={[0, 0, -34] as any} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[105, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 34] as any} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[105, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-52.5, 0, 0] as any} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[68, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[52.5, 0, 0] as any} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[68, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

function Goal({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position as any} rotation={rotation as any}>
      {/* Poteaux */}
      <mesh position={[-3.66, 1.22, 0] as any} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.44]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[3.66, 1.22, 0] as any} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.44]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Barre transversale */}
      <mesh position={[0, 2.44, 0] as any} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 7.32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Filets */}
      <GoalNet />
    </group>
  );
}

function GoalNet() {
  return (
    <group>
      <mesh position={[0, 1.22, -1.5] as any}>
        <planeGeometry args={[7.32, 2.44]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.4} 
        />
      </mesh>
    </group>
  );
}

function CenterCircle() {
  return (
    <group position={[0, 0.01, 0] as any}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0] as any}>
        <ringGeometry args={[9.15, 9.3, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0] as any}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

function PenaltySpot({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position as any} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.15, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
} 