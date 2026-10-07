import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tutors, introCamera, outroCamera } from '../data/tutors'

gsap.registerPlugin(ScrollTrigger)

export const scrollProgress = { value: 0 }

export const heroReveal = { value: 0 }

export function useScrollDriver() {
  useEffect(() => {
    const segmentCount = tutors.length + 1 
    const forestTween = gsap.to(scrollProgress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.forest-driver',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        snap: {
          snapTo: 1 / segmentCount,
          duration: { min: 0.2, max: 0.45 },
          delay: 0.02,
          ease: 'power2.out',
        },
        anticipatePin: 1,
      },
    })

    const heroTween = gsap.to(heroReveal, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
      },
    })

    return () => {
      forestTween.scrollTrigger?.kill()
      forestTween.kill()
      heroTween.scrollTrigger?.kill()
      heroTween.kill()
    }
  }, [])
}

function useCameraCurves() {
  return useMemo(() => {
    const posPoints = [introCamera.pos, ...tutors.map((t) => t.cameraPos), outroCamera.pos]
    const lookPoints = [introCamera.lookAt, ...tutors.map((t) => t.lookAt), outroCamera.lookAt]
    return {
      posCurve: new THREE.CatmullRomCurve3(posPoints, false, 'catmullrom', 0.35),
      lookCurve: new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.35),
    }
  }, [])
}

export function CameraSync() {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3())
  const { posCurve, lookCurve } = useCameraCurves()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scrollProgress.value, 0, 1)
    const pos = posCurve.getPoint(t)
    const look = lookCurve.getPoint(t)
    camera.position.copy(pos)
    lookTarget.current.copy(look)
    camera.lookAt(lookTarget.current)
  })

  return null
}
