import { Component, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn("FORME 3D preview unavailable:", error); }
  render() {
    if (this.state.failed) return <div className="scene-loading">3D preview is unavailable on this device. Explore the collection below.</div>;
    return this.props.children;
  }
}

function makeSideShape(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x,y]) => shape.lineTo(x,y));
  shape.closePath();
  return shape;
}

function Sneaker() {
  const shoe = useRef();
  const geometries = useMemo(() => {
    const sole = new THREE.Shape();
    sole.moveTo(-1.35,-0.22);
    sole.quadraticCurveTo(-1.48,-0.18,-1.43,-0.04);
    sole.lineTo(-1.22,0.02);
    sole.quadraticCurveTo(0.2,0.11,1.22,0.02);
    sole.quadraticCurveTo(1.48,-0.02,1.45,-0.2);
    sole.quadraticCurveTo(1.38,-0.31,1.15,-0.32);
    sole.lineTo(-1.18,-0.32);
    sole.quadraticCurveTo(-1.38,-0.32,-1.35,-0.22);
    const soleGeo = new THREE.ExtrudeGeometry(sole,{depth:0.82,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:0.045,bevelThickness:0.045,curveSegments:24});
    soleGeo.translate(0,0,-0.41);

    const mid = new THREE.Shape();
    mid.moveTo(-1.32,-0.14); mid.quadraticCurveTo(0,-0.04,1.39,-0.12);
    mid.lineTo(1.36,-0.2); mid.quadraticCurveTo(0,-0.27,-1.32,-0.23); mid.closePath();
    const midGeo = new THREE.ExtrudeGeometry(mid,{depth:0.84,bevelEnabled:true,bevelSegments:3,bevelSize:0.018,bevelThickness:0.02});
    midGeo.translate(0,0,-0.42);

    const upper = new THREE.Shape();
    upper.moveTo(-1.28,-0.12);
    upper.quadraticCurveTo(-1.35,0.12,-1.15,0.38);
    upper.quadraticCurveTo(-1.03,0.62,-0.86,0.68);
    upper.quadraticCurveTo(-0.68,0.74,-0.54,0.55);
    upper.quadraticCurveTo(-0.34,0.32,-0.05,0.22);
    upper.quadraticCurveTo(0.42,0.08,0.9,0.06);
    upper.quadraticCurveTo(1.2,0.05,1.38,-0.06);
    upper.quadraticCurveTo(1.48,-0.16,1.36,-0.2);
    upper.lineTo(-1.28,-0.2); upper.closePath();
    const upperGeo = new THREE.ExtrudeGeometry(upper,{depth:0.72,bevelEnabled:true,bevelSegments:5,bevelSize:0.055,bevelThickness:0.05,curveSegments:28});
    upperGeo.translate(0,0,-0.36);

    const panel = makeSideShape([[-0.98,0.43],[-0.72,0.49],[-0.45,0.28],[-0.12,0.18],[0.48,0.12],[0.18,0.02],[-0.38,0.12],[-0.76,0.31]]);
    const panelGeo = new THREE.ExtrudeGeometry(panel,{depth:0.025,bevelEnabled:true,bevelSegments:2,bevelSize:0.012,bevelThickness:0.01});
    panelGeo.translate(0,0,0.367);
    return {soleGeo,midGeo,upperGeo,panelGeo};
  },[]);

  useFrame((state,delta) => {
    if (!shoe.current) return;
    shoe.current.rotation.y += delta * 0.12;
    shoe.current.rotation.x = THREE.MathUtils.lerp(shoe.current.rotation.x,Math.sin(state.clock.elapsedTime*0.45)*0.035,0.035);
  });

  return <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.22}>
    <group ref={shoe} rotation={[0.02,-0.45,-0.08]} scale={1.24}>
      <mesh geometry={geometries.soleGeo} castShadow receiveShadow><meshStandardMaterial color="#282725" roughness={0.78}/></mesh>
      <mesh geometry={geometries.midGeo} castShadow><meshStandardMaterial color="#c6b9a7" roughness={0.62}/></mesh>
      <mesh geometry={geometries.upperGeo} castShadow receiveShadow><meshPhysicalMaterial color="#e9e4da" roughness={0.48} clearcoat={0.18} clearcoatRoughness={0.55}/></mesh>
      <mesh geometry={geometries.panelGeo} castShadow><meshStandardMaterial color="#a65d43" roughness={0.55}/></mesh>
      {[-0.28,-0.08,0.12,0.32].map((x,i)=><mesh key={i} position={[x,0.285-i*0.025,0.39]} rotation={[0,0,-0.16]} castShadow><boxGeometry args={[0.28,0.025,0.035]}/><meshStandardMaterial color="#6e655b" roughness={0.5}/></mesh>)}
      <mesh position={[-0.92,0.34,0.37]} rotation={[0,0,-0.12]}><boxGeometry args={[0.12,0.27,0.035]}/><meshStandardMaterial color="#b9aa98" roughness={0.6}/></mesh>
      <mesh position={[0.35,-0.09,0.425]}><torusGeometry args={[0.055,0.012,8,24]}/><meshStandardMaterial color="#a65d43" metalness={0.25}/></mesh>
      <mesh position={[0,0.38,0]}><boxGeometry args={[0.32,0.018,0.48]}/><meshStandardMaterial color="#ded6c9" roughness={0.7}/></mesh>
    </group>
  </Float>;
}

function Scene({progress}) {
  const group=useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = -0.16 + progress*1.25 + Math.sin(state.clock.elapsedTime*0.22)*0.035;
    group.current.position.y = -progress*0.24;
    group.current.rotation.z = progress*0.09;
  });
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[3.3,2.05,4.7],fov:35}} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}}>
    <color attach="background" args={["#eee9df"]}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[4,6,5]} intensity={2.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <spotLight position={[-4,3,2]} intensity={1.1} angle={0.45} penumbra={0.8} color="#d9a78e"/>
    <group ref={group}><Sneaker/></group>
    <ContactShadows position={[0,-0.72,0]} opacity={0.38} scale={5.5} blur={2.8} far={2.5}/>
    <Environment preset="studio"/>
  </Canvas>;
}

export default function HeroScene(props) {
  return <SceneErrorBoundary><Scene {...props}/></SceneErrorBoundary>;
}
