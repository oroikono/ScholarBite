import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 200 }) {
  const mesh = useRef()
  const { pointer } = useThree()

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel[i * 3] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
      // Red-ish accent tones
      col[i * 3] = 0.8 + Math.random() * 0.2
      col[i * 3 + 1] = 0.15 + Math.random() * 0.2
      col[i * 3 + 2] = 0.25 + Math.random() * 0.2
    }
    return [pos, vel, col]
  }, [count])

  useFrame(() => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position
    const arr = posAttr.array

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2

      // Mouse influence
      const dx = pointer.x * 5 - arr[ix]
      const dy = pointer.y * 3 - arr[iy]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 2) {
        arr[ix] += dx * 0.002
        arr[iy] += dy * 0.002
      }

      arr[ix] += velocities[ix]
      arr[iy] += velocities[iy]
      arr[iz] += velocities[iz]

      // Wrap
      if (arr[ix] > 5) arr[ix] = -5
      if (arr[ix] < -5) arr[ix] = 5
      if (arr[iy] > 3) arr[iy] = -3
      if (arr[iy] < -3) arr[iy] = 3
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
