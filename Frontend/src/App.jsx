import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Jungle from './components/Jungle'
import Character, { CharacterPedestal } from './components/Character'
import { CameraSync, useScrollDriver } from './components/CameraRig'
import Atmosphere from './components/Atmosphere'
import Overlay from './components/Overlay'
import Hero from './components/Hero'
import { CardFrames, CardContents } from './components/CardOverlay'
import Hud from './components/Hud'
import Leaderboards from './pages/Leaderboards'
import Forms from './pages/Forms'
import Manifesto from './pages/Manifesto'
import Curriculum from './pages/Curriculum'
import Login from './pages/Login'
import Register from './pages/Register'
import { tutors, introCamera } from './data/tutors'
import { AuthProvider } from './context/AuthContext'

const cameraProps = {
  position: introCamera.pos.toArray(),
  fov: 55,
  near: 0.1,
  far: 200,
}

function BgLights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#a8c8e0" />
      <hemisphereLight args={['#dfe9ff', '#1a3a22', 0.4]} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.4}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-8, 6, -10]} intensity={0.5} color="#6a9eff" />
    </>
  )
}

// Foreground canvas needs its own (matching) lighting since meshes there can't
// see lights in the bg canvas — they're separate WebGL contexts.
function FgLights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#a8c8e0" />
      <hemisphereLight args={['#dfe9ff', '#1a3a22', 0.35]} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} color="#ffd9a0" />
      <directionalLight position={[-8, 6, -10]} intensity={0.55} color="#6a9eff" />
    </>
  )
}

function MainSite() {
  useScrollDriver()

  return (
    <div className="app">
      {/* LAYER 1 — Background canvas: environment, fog, sparkles, mist */}
      <div className="canvas-layer canvas-bg">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={cameraProps}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Atmosphere />
          <BgLights />
          <Suspense fallback={null}>
            <Jungle />
            {/* Pedestals live in the bg canvas so they're lit by the
                environment and integrated with the jungle, not the
                bloomed/floating character canvas. */}
            {tutors.map((tutor, i) => (
              <CharacterPedestal key={tutor.id} tutor={tutor} index={i} />
            ))}
          </Suspense>
          <CameraSync />
        </Canvas>
      </div>

      {/* LAYER 2 — Card FRAME (panel + brackets, behind character) */}
      <CardFrames />

      {/* LAYER 3 — Foreground canvas: characters only, transparent background,
          rendered over the card frames so characters visually occlude the panel.
          Bloom here so the character glows pop without lifting the environment. */}
      <div className="canvas-layer canvas-fg">
        <Canvas
          dpr={[1, 1.75]}
          camera={cameraProps}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <fogExp2 attach="fog" args={['#0a1410', 0.022]} />
          <FgLights />
          <Suspense fallback={null}>
            {tutors.map((tutor, i) => (
              <Character key={tutor.id} tutor={tutor} index={i} />
            ))}
          </Suspense>
          <CameraSync />
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom intensity={1.0} luminanceThreshold={0.3} luminanceSmoothing={0.5} mipmapBlur />
            <Vignette eskil={false} offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* LAYER 4 — Card TEXT (renders on top of the character) */}
      <CardContents />

      {/* LAYER 5 — Hero overlay (with letter-glitch + plasma reveal) */}
      <Hero />

      {/* LAYER 5 — Persistent HUD frame */}
      <Hud />

      {/* LAYER 6 — Invisible scroll scaffolding (drives camera curve) */}
      <div className="scroll-driver">
        <section className="hero-section" aria-hidden="true" />
        <div className="forest-driver">
          <Overlay />
        </div>
      </div>

      {/* End tagline — full-width closing statement, fades vertically */}
      <section className="end-tagline">
        <h2 className="end-tagline-text">
          Code, <em>lived&nbsp;in</em>.
        </h2>
      </section>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<MainSite />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/forms"        element={<Forms />} />
          <Route path="/manifesto"   element={<Manifesto />} />
          <Route path="/curriculum"  element={<Curriculum />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}