import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function GroundMist() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.material.opacity = 0.18 + Math.sin(t * 0.4) * 0.04
    ref.current.position.x = Math.sin(t * 0.1) * 1.2
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -28]}>
      <planeGeometry args={[60, 100]} />
      <meshBasicMaterial
        color="#7fc4a8"
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function MistVolume() {
  const planes = [0.4, 1.0, 1.8]
  return (
    <group>
      {planes.map((y, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, -30]}>
          <planeGeometry args={[80, 120]} />
          <meshBasicMaterial
            color={i === 0 ? '#3a5a48' : '#1a2e25'}
            transparent
            opacity={0.06 - i * 0.015}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Atmosphere() {
  return (
    <>
      <fogExp2 attach="fog" args={['#0a1410', 0.022]} />
      <color attach="background" args={['#0a1410']} />

      <GroundMist />
      <MistVolume />

      <Sparkles
        count={120}
        scale={[40, 4, 100]}
        position={[0, 1.5, -30]}
        size={3}
        speed={0.3}
        color="#a8e0c4"
        opacity={0.7}
      />
      <Sparkles
        count={60}
        scale={[40, 2, 100]}
        position={[0, 0.6, -30]}
        size={1.5}
        speed={0.15}
        color="#fff5b8"
        opacity={0.4}
      />
    </>
  )
}
