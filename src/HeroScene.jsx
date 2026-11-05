import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// The sneaker is built from local Three.js geometry. No remote GLB, CORS,
// third-party model host, or device-specific download is required.
function makeSole() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.18, -0.31);
  shape.quadraticCurveTo(-1.25, -0.31, -1.25, -0.20);
  shape.quadraticCurveTo(-1.24, -0.10, -1.08, -0.08);
  shape.lineTo(0.76, -0.08);
  shape.quadraticCurveTo(1.18, -0.10, 1.25, -0.24);
  shape.quadraticCurveTo(1.27, -0.34, 1.12, -0.37);
  shape.lineTo(-1.08, -0.37);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.48, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 12 });
  geometry.translate(0, 0, -0.24);
  geometry.computeVertexNormals();
  return geometry;
}

function makeUpper() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.10, -0.12);
  shape.quadraticCurveTo(-1.13, 0.02, -0.96, 0.12);
  shape.lineTo(-0.53, 0.38);
  shape.quadraticCurveTo(-0.30, 0.48, -0.08, 0.43);
  shape.lineTo(0.45, 0.22);
  shape.quadraticCurveTo(0.82, 0.12, 1.13, -0.12);
  shape.quadraticCurveTo(1.19, -0.20, 1.08, -0.22);
  shape.lineTo(-1.02, -0.22);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.39, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.075, bevelThickness: 0.075, curveSegments: 16 });
  geometry.translate(0, 0, -0.195);
  geometry.computeVertexNormals();
  return geometry;
}

function Sneaker({ progress }) {
  const root = useRef();
  const upperGeometry = useMemo(makeUpper, []);
  const soleGeometry = useMemo(makeSole, []);
  const laceCurves = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const y = 0.255 - i * 0.047;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.52 + i * 0.045, y, -0.205),
      new THREE.Vector3(-0.27 + i * 0.025, y + 0.035, -0.225),
      new THREE.Vector3(-0.04 + i * 0.025, y, -0.205),
    ]);
    return curve;
  }), []);

  useFrame((state, delta) => {
    if (!root.current) return;
    // One full 360° turn is scrubbed by the hero section's scroll progress.
    root.current.rotation.y = -0.52 + progress * Math.PI * 2;
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.035;
    root.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.012;
  });

  return <group ref={root} rotation={[0, -0.52, 0]} scale={1.02}>
    {/* Outsole and contrasting midsole */}
    <mesh geometry={soleGeometry} castShadow receiveShadow>
      <meshStandardMaterial color="#292b28" roughness={0.82}/>
    </mesh>
    <mesh position={[0, -0.115, 0]} scale={[1, 0.72, 1.015]} castShadow>
      <boxGeometry args={[2.25, 0.12, 0.43]}/>
      <meshStandardMaterial color="#e6e0d5" roughness={0.72}/>
    </mesh>
    {/* Main canvas upper */}
    <mesh geometry={upperGeometry} position={[0, 0.015, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#e9e3d8" roughness={0.88}/>
    </mesh>
    {/* Sage heel counter and side overlays */}
    <mesh position={[-0.76, 0.105, 0.205]} rotation={[0, 0, -0.22]} scale={[0.34, 0.23, 0.035]}>
      <sphereGeometry args={[1, 32, 24]}/>
      <meshStandardMaterial color="#879184" roughness={0.9}/>
    </mesh>
    <mesh position={[0.39, 0.085, 0.205]} rotation={[0, 0, 0.18]} scale={[0.52, 0.095, 0.035]}>
      <sphereGeometry args={[1, 32, 20]}/>
      <meshStandardMaterial color="#9ca391" roughness={0.9}/>
    </mesh>
    {/* Tongue */}
    <mesh position={[-0.20, 0.355, 0]} rotation={[0, 0, -0.22]} scale={[0.27, 0.20, 0.16]}>
      <sphereGeometry args={[1, 32, 24]}/>
      <meshStandardMaterial color="#d8d1c5" roughness={0.9}/>
    </mesh>
    {/* Coral lace loops */}
    {laceCurves.map((curve, i) => <mesh key={i}>
      <tubeGeometry args={[curve, 18, 0.012, 8, false]}/>
      <meshStandardMaterial color="#bd755f" roughness={0.58}/>
    </mesh>)}
    {/* Eyelets */}
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.48 + i * 0.105, 0.27 - i * 0.038, 0.224]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.025, 0.008, 8, 16]}/>
      <meshStandardMaterial color="#77796f" metalness={0.35} roughness={0.45}/>
    </mesh>)}
    {/* Heel pull tab */}
    <mesh position={[-0.91, 0.28, 0]} rotation={[0, 0, -0.28]}>
      <boxGeometry args={[0.10, 0.32, 0.09]}/>
      <meshStandardMaterial color="#879184" roughness={0.85}/>
    </mesh>
    {/* Fine outsole tread */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.91 + i * 0.23, -0.365, 0.255]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.105, 0.018, 0.012]}/>
      <meshStandardMaterial color="#77766e" roughness={1}/>
    </mesh>)}
  </group>;
}

function ScrollCamera({ progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const zoom = Math.sin(progress * Math.PI);
    target.set(3.45 + zoom * 0.7, 1.65 + zoom * 0.28, 5.25 - zoom * 1.05);
    camera.position.lerp(target, 0.065);
    camera.lookAt(0, 0.02, 0);
  });
  return null;
}

function Scene({ progress }) {
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.45, 1.65, 5.25], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <color attach="background" args={["#eee9df"]}/>
    <ambientLight intensity={1.25}/>
    <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <spotLight position={[-4, 3, 2]} intensity={1.1} angle={0.48} penumbra={0.8} color="#d9a78e"/>
    <Sneaker progress={progress}/>
    <Environment preset="studio"/>
    <ContactShadows position={[0, -0.48, 0]} opacity={0.34} scale={5} blur={2.6} far={2.2}/>
    <ScrollCamera progress={progress}/>
  </Canvas>;
}

export default function HeroScene({ progress = 0 }) {
  return <Scene progress={progress}/>;
}
