import { Dispatch, SetStateAction, Suspense, useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

import { fadeInAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

type GravityParticlesMode = 'container' | 'full-screen';

// The properties of each particle
type ParticleProperties = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: THREE.Color;
};

// Generates the particles properties based on the numbers, mode, size and base color
const generateParticlesProperties = (numbers: number): ParticleProperties[] => {
  const particles: ParticleProperties[] = [];

  for (let i = 0; i < numbers; i++) {
    // Generate random properties for each particle
    const position = new THREE.Vector3(
      Math.random() * 10000 - 5000,
      Math.random() * 10000 - 5000,
      Math.random() * 10000 - 5000,
    );
    const rotation = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );
    const scale = Math.random() * 200 + 100;
    const color = new THREE.Color(Math.random() * 0xffffff);

    particles.push({
      position,
      rotation,
      scale,
      color,
    });
  }
  return particles;
};

// Mesh of particles with auto rotation
const AnimatedMesh = ({
  numbers,
  mode,
  active,
  isParticlesHover,
  setIsParticlesHover,
}: {
  numbers: number;
  mode: GravityParticlesMode;
  active: boolean;
  isParticlesHover: boolean;
  setIsParticlesHover: Dispatch<SetStateAction<boolean>>;
}) => {
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const renderTarget = useRef<THREE.WebGLRenderTarget>(
    new THREE.WebGLRenderTarget(size.width, size.height),
  );

  // State to manage hover state of the particles
  const deBouncedHoverToggle = useRef<NodeJS.Timeout | null>(null);
  const hoverToggleCoolingDown = useRef<NodeJS.Timeout | null>(null);

  // The scale rate and position of the particles depend on the device.
  const responsivePosition =
    size.width > 768
      ? new THREE.Vector3(size.width * 1.6, size.height * -0.99, 0)
      : new THREE.Vector3(size.width * 1.1, size.height * 1.25, 0);
  const responsiveScale = size.width > 768 ? 0.05 : 0.04;

  // We warp the particles when they are not hovered in `container` mode.
  const { scale, position } = useSpring({
    scale: mode === 'full-screen' || isParticlesHover ? 1 : responsiveScale,
    position:
      mode === 'full-screen' || isParticlesHover ? new THREE.Vector3(0, 0, 0) : responsivePosition,
    config: { tension: 120, friction: 30 },
  });

  // Generate particles based on the numbers, mode and size
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const particlesProps = generateParticlesProperties(numbers);
    console.log(`Generated ${particlesProps.length} particles`);
    for (let i = 0; i < particlesProps.length; i++) {
      dummy.position.copy(particlesProps[i].position);
      dummy.rotation.copy(particlesProps[i].rotation);
      dummy.scale.setScalar(particlesProps[i].scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, particlesProps[i].color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [numbers, mode]);

  // Update the render target size when the canvas size changes
  useEffect(() => {
    renderTarget.current.setSize(size.width, size.height);
  }, [size]);

  // Rotate the particles group, pause when not active
  useFrame((_state, delta) => {
    if (!active || !groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.2;
  });

  // To handle the hover state with debounce and cooling down
  const debouncedHoverToggle = (value: boolean) => {
    if (isParticlesHover === value || hoverToggleCoolingDown.current) return;
    if (deBouncedHoverToggle.current) clearTimeout(deBouncedHoverToggle.current); // Clear previous debounce
    deBouncedHoverToggle.current = setTimeout(() => {
      console.log(`Hover event: ${value ? 'Start' : 'End'}`);
      deBouncedHoverToggle.current = null; // Reset debounce reference
      if (value !== isParticlesHover) setIsParticlesHover(value);
      hoverToggleCoolingDown.current = setTimeout(() => {
        // Set a guard to prevent immediate re-triggering
        hoverToggleCoolingDown.current = null; // Reset hover guard after debounce
      }, 500);
    }, 500); // Debounce for 500ms
  };

  // Handle hover events.
  const hoverHandler = () => {
    debouncedHoverToggle(true); // Set hover state to true with debounce
  };

  // Handle hover end events.
  const hoverEndHandler = () => {
    debouncedHoverToggle(false); // Set hover state to false with debounce
  };

  // Toggle the hover state on click.
  const hoverToggleHandler = () => {
    debouncedHoverToggle(!isParticlesHover); // Set hover state to false with debounce
  };

  // On mount protector.
  useEffect(() => {
    hoverToggleCoolingDown.current = setTimeout(() => {
      hoverToggleCoolingDown.current = null;
    }, 300);
  }, []);

  // Unmount sweeper.
  useEffect(() => {
    return () => {
      if (deBouncedHoverToggle.current) {
        clearTimeout(deBouncedHoverToggle.current);
        deBouncedHoverToggle.current = null;
      }
      if (hoverToggleCoolingDown.current) {
        clearTimeout(hoverToggleCoolingDown.current);
        hoverToggleCoolingDown.current = null;
      }
    };
  }, []);

  // To toggle visibility of the hover helper box
  const visibleHoverHelper = true;

  const helperBoxSize = isParticlesHover ? Math.max(size.width, size.height) * 5 : 10000;

  return (
    <animated.group ref={groupRef} scale={scale} position={position}>
      {/* The helper box for event handling. */}
      <mesh
        onPointerMove={hoverHandler} // Handle hover start (not work on mobile)
        onPointerLeave={hoverEndHandler} // Handle hover end (not work on mobile)
        onPointerDown={hoverToggleHandler} // Handle click to toggle hover state (works on desktop/mobile)
        onPointerMissed={hoverEndHandler} // Handle click outside to end hover state (may not work on mobile)
        visible={visibleHoverHelper} // Toggle visibility of the helper box(for debugging)
        frustumCulled={false}
      >
        <boxGeometry args={[helperBoxSize, helperBoxSize, helperBoxSize]} />
        <meshBasicMaterial color='red' transparent opacity={0.3} wireframe />
      </mesh>

      {/* Particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, numbers]}>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial flatShading metalness={0.8} roughness={0.5} />
      </instancedMesh>
    </animated.group>
  );
};

/**
 * @summary ParticlesTransition component
 * @description
 * This component is inspired by https://github.com/bobbyroe/transition-effect.
 * I ported it to React-Three-Fiber and modified to fit the needs of the project.
 *
 * This component generates bunch of particles, and performs a transition effect
 * periodically and on hover/click.
 * The effect is active only when the component is in view for performance reasons.
 * But I don't unmount it since the loading may also be expensive.
 */
const GravityParticles = ({
  mode,
  isParticlesHover,
  setIsParticlesHover,
}: {
  mode: GravityParticlesMode;
  isParticlesHover: boolean;
  setIsParticlesHover: Dispatch<SetStateAction<boolean>>;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px' });

  const numbers = mode === 'container' ? 1000 : 1000; // Adjust numbers based on mode
  const position =
    mode === 'container' ? new THREE.Vector3(0, 0, 5000) : new THREE.Vector3(0, 0, 80000);

  return (
    <motion.div
      ref={ref}
      className={cn('absolute inset-0 z-50 h-full w-full')}
      data-role='particles-transition'
      aria-hidden='true'
      {...fadeInAnimation}
    >
      <Canvas
        className='z-8 h-full w-full'
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
        }}
      >
        <Suspense fallback={null}>
          <primitive object={new THREE.FogExp2('#ffffff', 0.0001)} attach='fog' />
          <PerspectiveCamera makeDefault position={position} near={1} far={100000} fov={20} />
          <ambientLight intensity={0.15} />
          <hemisphereLight args={[0x0099ff, 0xaa5500, 0.4]} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} />
          <AnimatedMesh
            numbers={numbers}
            mode={mode}
            active={isInView}
            isParticlesHover={isParticlesHover}
            setIsParticlesHover={setIsParticlesHover}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default GravityParticles;
