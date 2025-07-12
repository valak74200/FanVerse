"use client"

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Stands() {
  return (
    <group>
      <Stand 
        position={[0, 0, 40]} 
        sections={25} 
        rows={35} 
        type="main"
        capacity={15000}
      />
      <Stand 
        position={[0, 0, -40]} 
        rotation={[0, Math.PI, 0]}
        sections={25} 
        rows={35} 
        type="opposite"
        capacity={15000}
      />
      <Stand 
        position={[65, 0, 0]} 
        rotation={[0, -Math.PI/2, 0]}
        sections={20} 
        rows={30} 
        type="side"
        capacity={10000}
      />
      <Stand 
        position={[-65, 0, 0]} 
        rotation={[0, Math.PI/2, 0]}
        sections={20} 
        rows={30} 
        type="side"
        capacity={10000}
      />
    </group>
  );
}

interface StandProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  sections: number;
  rows: number;
  type: 'main' | 'opposite' | 'side';
  capacity: number;
}

function Stand({ position, rotation = [0, 0, 0], sections, rows, type, capacity }: StandProps) {
  const standRef = useRef(null as any);
  
  // Génération des positions des sièges
  const seatPositions = useMemo(() => {
    const seats: [number, number, number][] = [];
    
    for (let section = 0; section < sections; section++) {
      for (let row = 0; row < rows; row++) {
        const angle = (section / sections) * Math.PI - Math.PI / 2;
        const radius = 45 + row * 0.8;
        const height = row * 0.5 + 2;
        
        const x = Math.cos(angle) * radius;
        const y = height;
        const z = Math.sin(angle) * radius;
        
        seats.push([x, y + 0.4, z]);
      }
    }
    
    return seats;
  }, [sections, rows]);
  
  useFrame((state) => {
    if (standRef.current) {
      // Léger mouvement de respiration
      standRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  
  return (
    <group ref={standRef} position={position as any} rotation={rotation as any}>
      {/* Structure principale des gradins */}
      <StandStructure sections={sections} rows={rows} type={type} />
      
      {/* Sièges individuels */}
      <Seats positions={seatPositions} type={type} />
      
      {/* Barrières de sécurité */}
      <SafetyBarriers sections={sections} rows={rows} />
    </group>
  );
}

function StandStructure({ sections, rows, type }: { sections: number, rows: number, type: string }) {
  const color = type === 'main' ? '#2563eb' : type === 'opposite' ? '#dc2626' : '#6b7280';
  
  return (
    <mesh castShadow receiveShadow position={[0, rows * 0.25, 0] as any}>
      <cylinderGeometry args={[45, 52, rows * 0.5, sections, 1, true]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function Seats({ positions, type }: { positions: [number, number, number][], type: string }) {
  const seatColor = type === 'main' ? '#1e40af' : type === 'opposite' ? '#b91c1c' : '#4b5563';
  
  // Affichage simplifié des sièges (quelques échantillons pour les performances)
  const displayPositions = positions.filter((_, i) => i % 10 === 0);
  
  return (
    <group>
      {displayPositions.map((pos, i) => (
        <mesh key={i} position={pos as any} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.3]} />
          <meshStandardMaterial color={seatColor} />
        </mesh>
      ))}
    </group>
  );
}

function SafetyBarriers({ sections, rows }: { sections: number, rows: number }) {
  return (
    <group>
      {Array.from({ length: Math.floor(sections / 5) }, (_, i) => {
        const angle = (i * 5 / sections) * Math.PI - Math.PI / 2;
        const radius = 50;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh 
            key={i} 
            position={[x, rows * 0.25, z] as any} 
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.1, rows * 0.5, 2]} />
            <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
} 