import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { tutors } from '../data/tutors'
import { scrollProgress } from './CameraRig'

function useNearActive(index, ref, threshold = 0.55) {
  const segments = tutors.length + 1
  const myCenter = (index + 1) / segments
  useFrame(() => {
    const p = scrollProgress.value
    const distance = Math.abs(p - myCenter)
    const visible = distance < threshold / segments || p > 0.92
    if (ref.current && ref.current.visible !== visible) {
      ref.current.visible = visible
    }
  })
}

function ShapeForVibe({ shape, color, accent }) {
  switch (shape) {
    case 'sphere':
      return (
        <group>
          <mesh castShadow>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial color={color} roughness={0.4} flatShading />
          </mesh>
          <mesh scale={1.25}>
            <icosahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color={accent} transparent opacity={0.18} />
          </mesh>
        </group>
      )
    case 'octahedron':
      return (
        <group>
          <mesh castShadow>
            <octahedronGeometry args={[1.0, 0]} />
            <meshStandardMaterial color={color} flatShading metalness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} scale={1.4}>
            <torusGeometry args={[0.9, 0.04, 8, 32]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
          </mesh>
        </group>
      )
    case 'torus':
      return (
        <group>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.22, 12, 32]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} scale={0.7}>
            <torusGeometry args={[0.7, 0.18, 12, 32]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
          </mesh>
        </group>
      )
    case 'boxes': {
      const cubes = [-1, 0, 1]
      return (
        <group>
          {cubes.map((x) => (
            <mesh key={x} position={[x * 0.55, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.45, 0.45]} />
              <meshStandardMaterial color={x === 0 ? accent : color} flatShading />
            </mesh>
          ))}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh position={[0, -0.7, 0]} castShadow>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
        </group>
      )
    }
    case 'modular':
      return (
        <group>
          <mesh position={[-0.55, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh position={[0.55, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.275, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.55, 8]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
          </mesh>
        </group>
      )
    case 'irregular':
    default:
      return (
        <group>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh position={[0.6, 0.4, 0.5]} castShadow scale={0.45}>
            <tetrahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
          <mesh position={[-0.5, -0.3, 0.6]} castShadow scale={0.5}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
        </group>
      )
  }
}

export function CharacterPedestal({ tutor, index }) {
  const groupRef = useRef()
  const ringRef = useRef()

  useNearActive(index, groupRef)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={groupRef} position={tutor.position}>
      {/* Glow ring on the ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <ringGeometry args={[0.9, 1.3, 32]} />
        <meshBasicMaterial color={tutor.accent} transparent opacity={0.35} />
      </mesh>

      {/* Pedestal */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.0, 0.4, 12]} />
        <meshStandardMaterial color="#2a2018" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}
export default function Character({ tutor, index }) {
  const groupRef = useRef()
  const ref = useRef()

  useNearActive(index, groupRef)

  useFrame((state) => {
    const t = state.clock.elapsedTime + index * 0.7
    if (ref.current) {
      ref.current.position.y = 1.4 + Math.sin(t * 1.2) * 0.15
      ref.current.rotation.y = t * 0.3
    }
  })

  return (
    
    <group ref={groupRef} position={tutor.position}>
      <group ref={ref} position={[0, 1.4, 0]} scale={0.7}>
        <ShapeForVibe shape={tutor.shape} color={tutor.color} accent={tutor.accent} />
        <pointLight color={tutor.color} intensity={2.5} distance={10} />
      </group>
    </group>
  )
}
