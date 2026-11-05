import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function PhoneModel({ progress }) {
  const root = useRef();
  const glyphDots = useMemo(() => Array.from({ length: 49 }, (_, i) => ({
    x: (i % 7 - 3) * 0.035,
    y: (Math.floor(i / 7) - 3) * 0.035,
  })), []);
  useFrame((state) => {
    if (!root.current) return;
    root.current.rotation.y = -0.35 + progress * Math.PI * 2;
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.025;
    root.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.012;
  });
  return <group ref={root} scale={1.12}>
    {/* Precision aluminium chassis */}
    <RoundedBox args={[0.94, 1.92, 0.115]} radius={0.105} smoothness={8} castShadow receiveShadow>
      <meshStandardMaterial color="#c9cbc8" metalness={0.82} roughness={0.28}/>
    </RoundedBox>
    {/* Rear glass panel */}
    <RoundedBox args={[0.91, 1.89, 0.035]} radius={0.09} smoothness={8} position={[0,0,0.067]}>
      <meshPhysicalMaterial color="#e7e9e7" metalness={0.22} roughness={0.24} clearcoat={0.8}/>
    </RoundedBox>
    {/* Transparent-inspired engineering panels */}
    <mesh position={[0.02,0.02,0.09]}>
      <boxGeometry args={[0.46,1.12,0.008]}/>
      <meshStandardMaterial color="#c4c9c5" transparent opacity={0.34} metalness={0.35} roughness={0.4}/>
    </mesh>
    <mesh position={[0.03,0.54,0.101]}>
      <boxGeometry args={[0.4,0.035,0.012]}/>
      <meshStandardMaterial color="#8b918d" metalness={0.75} roughness={0.35}/>
    </mesh>
    <mesh position={[0.03,-0.39,0.101]}>
      <boxGeometry args={[0.42,0.025,0.012]}/>
      <meshStandardMaterial color="#9ca29e" metalness={0.7} roughness={0.4}/>
    </mesh>
    {/* Camera island and three lenses */}
    <RoundedBox args={[0.42,0.58,0.075]} radius={0.09} smoothness={6} position={[-0.22,0.57,0.115]}>
      <meshStandardMaterial color="#d7d9d6" metalness={0.65} roughness={0.3}/>
    </RoundedBox>
    {[[ -0.32,0.72 ],[-0.12,0.72],[-0.32,0.49 ]].map(([x,y],i)=><group key={i} position={[x,y,0.16]}>
      <mesh><cylinderGeometry args={[0.082,0.082,0.035,40]}/><meshStandardMaterial color="#777d79" metalness={0.8} roughness={0.25}/></mesh>
      <mesh position={[0,0,0.021]}><cylinderGeometry args={[0.061,0.061,0.012,40]}/><meshStandardMaterial color="#151b1c" metalness={0.3} roughness={0.14}/></mesh>
      <mesh position={[0.018,0.018,0.03]}><sphereGeometry args={[0.012,12,12]}/><meshBasicMaterial color="#8fc7d5"/></mesh>
    </group>)}
    <mesh position={[-0.12,0.49,0.15]}><sphereGeometry args={[0.034,20,20]}/><meshBasicMaterial color="#f4f2e8"/></mesh>
    {/* Glyph Matrix: a 7 x 7 micro-LED dot field */}
    <mesh position={[0.25,0.12,0.116]}><circleGeometry args={[0.19,48]}/><meshStandardMaterial color="#b9bfba" metalness={0.55} roughness={0.38}/></mesh>
    {glyphDots.map((dot,i)=><mesh key={i} position={[0.25+dot.x,0.12+dot.y,0.132]}>
      <circleGeometry args={[0.008,12]}/><meshBasicMaterial color={i%4===0?"#f5f6ef":"#747d77"}/>
    </mesh>)}
    <mesh position={[0.25, -0.28, 0.112]}><ringGeometry args={[0.075,0.091,48]}/><meshStandardMaterial color="#a7ada8" metalness={0.7}/></mesh>
    {/* Side controls */}
    <mesh position={[0.48,0.38,0]}><boxGeometry args={[0.035,0.23,0.055]}/><meshStandardMaterial color="#8b918d" metalness={0.85}/></mesh>
    <mesh position={[-0.48,0.28,0]}><boxGeometry args={[0.035,0.15,0.055]}/><meshStandardMaterial color="#8b918d" metalness={0.85}/></mesh>
    {/* Front display */}
    <RoundedBox args={[0.89,1.87,0.018]} radius={0.085} smoothness={8} position={[0,0,-0.068]}>
      <meshStandardMaterial color="#090d10" roughness={0.16} metalness={0.12}/>
    </RoundedBox>
    <mesh position={[0,0.05,-0.081]}>
      <planeGeometry args={[0.78,1.64]}/>
      <meshBasicMaterial color="#11191d"/>
    </mesh>
    <mesh position={[0,0.57,-0.084]}>
      <circleGeometry args={[0.045,32]}/>
      <meshBasicMaterial color="#050708"/>
    </mesh>
    <mesh position={[0,0.12,-0.085]}>
      <torusGeometry args={[0.22,0.012,8,64]}/>
      <meshBasicMaterial color="#82918a"/>
    </mesh>
    <mesh position={[0,0.12,-0.086]}>
      <circleGeometry args={[0.18,48]}/>
      <meshBasicMaterial color="#1b2826"/>
    </mesh>
    <mesh position={[0,-0.42,-0.085]}>
      <planeGeometry args={[0.48,0.025]}/>
      <meshBasicMaterial color="#69736e"/>
    </mesh>
  </group>;
}

function ScrollCamera({ progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const zoom = Math.sin(progress * Math.PI);
    target.set(3.1 + zoom * 0.38, 1.4 + zoom * 0.2, 5.1 - zoom * 0.65);
    camera.position.lerp(target, 0.065);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ progress }) {
  return <Canvas shadows dpr={[1,1.5]} camera={{ position:[3.1,1.4,5.1], fov:34 }} gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}>
    <color attach="background" args={["#e7ebe4"]}/>
    <ambientLight intensity={1.35}/>
    <directionalLight position={[4,6,5]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <spotLight position={[-4,3,2]} intensity={1.1} angle={0.48} penumbra={0.8} color="#d9e5df"/>
    <PhoneModel progress={progress}/>
    <Environment preset="studio"/>
    <ContactShadows position={[0,-1.2,0]} opacity={0.3} scale={4.8} blur={2.5} far={2.5}/>
    <ScrollCamera progress={progress}/>
  </Canvas>;
}

export default function HeroScene({ progress = 0 }) {
  return <Scene progress={progress}/>;
}
