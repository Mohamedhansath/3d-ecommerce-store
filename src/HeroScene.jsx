import { Component, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SHOE_MODEL_URL = "https://grab3d.com/dl/sneaker/sneaker.glb";

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn("FORME 3D model unavailable:", error); }
  render() {
    if (this.state.failed) return <div className="scene-loading">The 3D model could not load on this device. Please refresh or explore the collection below.</div>;
    return this.props.children;
  }
}

function RealShoe({ progress }) {
  const shoeGroup = useRef();
  const { scene } = useGLTF(SHOE_MODEL_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material = node.material.clone();
          node.material.envMapIntensity = 0.85;
        }
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 2.8 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!shoeGroup.current) return;
    // One complete 360-degree turn across the hero scroll range.
    shoeGroup.current.rotation.y = -0.35 + progress * Math.PI * 2;
    shoeGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.045;
    shoeGroup.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.018;
  });

  return <group ref={shoeGroup} rotation={[0,-0.35,0]}>
    <Center><primitive object={model} /></Center>
  </group>;
}

function ScrollCamera({ progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const zoom = Math.sin(progress * Math.PI);
    target.set(
      3.7 + zoom * 1.1,
      2.15 + zoom * 0.42,
      5.7 - zoom * 1.35
    );
    camera.position.lerp(target, 0.055);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Scene({ progress }) {
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[3.7,2.15,5.7],fov:34}} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}}>
    <color attach="background" args={["#eee9df"]}/>
    <ambientLight intensity={1.15}/>
    <directionalLight position={[4,6,5]} intensity={2.35} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <spotLight position={[-4,3,2]} intensity={1.15} angle={0.48} penumbra={0.8} color="#d9a78e"/>
    <Suspense fallback={<Html center><div className="scene-loading">Loading 3D sneaker…</div></Html>}><RealShoe progress={progress}/><Environment preset="studio"/></Suspense>
    <ScrollCamera progress={progress}/>
    <ContactShadows position={[0,-0.72,0]} opacity={0.36} scale={5.5} blur={2.8} far={2.5}/>
  </Canvas>;
}

useGLTF.preload(SHOE_MODEL_URL);

export default function HeroScene(props) {
  return <SceneErrorBoundary><Scene {...props}/></SceneErrorBoundary>;
}
