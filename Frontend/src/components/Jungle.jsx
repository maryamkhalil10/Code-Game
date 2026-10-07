import { useMemo } from 'react'
import { tutors } from '../data/tutors'

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function insideAnyClearing(x, z) {
  for (const tutor of tutors) {
    const dx = tutor.position.x - x
    const dz = tutor.position.z - z
    const r = tutor.clearing ?? 4
    if (dx * dx + dz * dz < r * r) return true
  }
  return false
}

function Tree({ position, scale, rotation, trunkColor, foliageColor }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 1.2, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.9, 1.4, 6]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.7, 1.1, 6]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[0.5, 0.9, 6]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} flatShading />
      </mesh>
    </group>
  )
}

function Rock({ position, scale, rotation }) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#5a6470" roughness={0.95} flatShading />
    </mesh>
  )
}

function FernBlade({ position, rotation, scale, color }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[0.18, 0.9, 4]} />
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  )
}

export default function Jungle() {
  const trees = useMemo(() => {
    const rand = mulberry32(1337)
    const items = []
    const palette = [
      ['#3a2a1f', '#3f7d4e'],
      ['#3a2a1f', '#2f6f44'],
      ['#3a2a1f', '#4a8b5a'],
      ['#2e2218', '#286b3c'],
      ['#28201a', '#1f5a3a'],
    ]
    for (let z = 8; z > -75; z -= 1.2) {
      const count = 8
      for (let i = 0; i < count; i++) {
        const side = i < count / 2 ? -1 : 1
        const offset = 5 + rand() * 14
        const x = side * offset + (rand() - 0.5) * 1.5
        const zJitter = z + (rand() - 0.5) * 1.4
        if (Math.abs(x) < 4) continue // path corridor
        if (insideAnyClearing(x, zJitter)) continue
        const [trunk, foliage] = palette[Math.floor(rand() * palette.length)]
        items.push({
          key: `${z}-${i}`,
          position: [x, 0, zJitter],
          scale: 0.7 + rand() * 0.9,
          rotation: rand() * Math.PI * 2,
          trunkColor: trunk,
          foliageColor: foliage,
        })
      }
    }
    return items
  }, [])

  const rocks = useMemo(() => {
    const rand = mulberry32(99)
    const items = []
    for (let i = 0; i < 80; i++) {
      const z = 8 - rand() * 80
      const side = rand() > 0.5 ? -1 : 1
      const x = side * (4 + rand() * 12)
      if (insideAnyClearing(x, z)) continue
      items.push({
        key: i,
        position: [x, -0.2, z],
        scale: 0.4 + rand() * 0.7,
        rotation: rand() * Math.PI * 2,
      })
    }
    return items
  }, [])

  const ferns = useMemo(() => {
    const rand = mulberry32(7777)
    const items = []
    const colors = ['#3f7d4e', '#2f6f44', '#4a8b5a', '#356a3f']
    for (let i = 0; i < 220; i++) {
      const z = 8 - rand() * 80
      const side = rand() > 0.5 ? -1 : 1
      const x = side * (2 + rand() * 14)
      if (Math.abs(x) < 1.6) continue
      if (insideAnyClearing(x, z)) continue
      items.push({
        key: i,
        position: [x, 0.2, z],
        rotation: [rand() * 0.4 - 0.2, rand() * Math.PI * 2, rand() * 0.4 - 0.2],
        scale: 0.5 + rand() * 0.5,
        color: colors[Math.floor(rand() * colors.length)],
      })
    }
    return items
  }, [])

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -30]} receiveShadow>
        <planeGeometry args={[80, 110]} />
        <meshStandardMaterial color="#1a2e1f" roughness={1} />
      </mesh>

      {/* Path strip down the middle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, -30]}>
        <planeGeometry args={[2.8, 110]} />
        <meshStandardMaterial color="#3a2d20" roughness={1} />
      </mesh>

      {/* Path edge highlights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, -0.17, -30]}>
        <planeGeometry args={[0.15, 110]} />
        <meshStandardMaterial color="#5a4a32" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.6, -0.17, -30]}>
        <planeGeometry args={[0.15, 110]} />
        <meshStandardMaterial color="#5a4a32" roughness={1} />
      </mesh>

      {trees.map((t) => (
        <Tree {...t} />
      ))}

      {rocks.map((r) => (
        <Rock {...r} />
      ))}

      {ferns.map((f) => (
        <FernBlade {...f} />
      ))}
    </group>
  )
}
