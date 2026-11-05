import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { Component } from "react";

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn("FORME 3D preview unavailable:", error); }
  render() {
    if (this.state.failed) return <div className="scene-loading">3D preview is unavailable on this device. You can still explore the collection below.</div>;
    return this.props.children;
  }
}

function Sneaker() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.035, 0.03);
    }
  });
  return <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
    <group ref={group} rotation={[0.05, -0.35, -0.12]} scale={1.15}>
      <mesh castShadow position={[0, 0, 0]}><capsuleGeometry args={[0.48, 1.5, 8, 20]} /><meshStandardMaterial color="#e7e2d8" roughness={0.42} /></mesh>
      <mesh castShadow position={[0, -0.39, 0.02]} scale={[1.02, 0.16, 1.02]}><capsuleGeometry args={[0.48, 1.5, 8, 20]} /><meshStandardMaterial color="#282725" roughness={0.7} /></mesh>
      <mesh castShadow position={[0, 0.34, 0.18]} rotation={[0, 0, 0.15]} scale={[0.5, 0.24, 0.12]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#b7a18b" roughness={0.55} /></mesh>
      {[0,1,2,3].map((v)=><mesh key={v} position={[-0.18 + v*0.12, 0.24-v*0.08, 0.47]} rotation={[0,0,-0.28]}><boxGeometry args={[0.42,0.025,0.025]} /><meshStandardMaterial color="#8d8173" /></mesh>)}
      <mesh position={[0,0.05,-0.43]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[0.22,0.045,8,32,Math.PI]} /><meshStandardMaterial color="#b6a18b" /></mesh>
    </group>
  </Float>;
}

function Scene({ progress }) {
  const scene = useRef();
  useFrame(() => { if (scene.current) { scene.current.rotation.y = progress * 1.05; scene.current.position.y = -progress * 0.28; } });
  return <Canvas fallback={<div className="scene-loading">3D preview is unavailable on this device. You can still explore the collection below.</div>} shadows dpr={[1,1.25]} camera={{ position: [3.6, 2.2, 5.2], fov: 36 }}>
    <ambientLight intensity={1.25} />
    <directionalLight position={[4,6,5]} intensity={2.2} castShadow />
    <group ref={scene}><Sneaker /></group>
    <ContactShadows position={[0,-1.25,0]} opacity={0.35} scale={5} blur={2.5} far={3} />
    <Environment preset="studio" />
  </Canvas>;
}

export default function HeroScene(props) {
  return <SceneErrorBoundary><Scene {...props} /></SceneErrorBoundary>;
}
