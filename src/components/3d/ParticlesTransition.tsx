import { Suspense, useEffect, useRef } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, Size } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

import { fadeInAnimation } from '@/lib/animations';

type ParticlesTransitionMode = 'wrapped' | 'full-screen';

// The properties of each particle
type ParticleProperties = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: THREE.Color;
};

// Returns different scale values based on the transition mode
const getParticleScale = (mode: ParticlesTransitionMode): number => {
  switch (mode) {
    case 'full-screen':
      return Math.random() * 200 + 100; // Scale between 100 and 300
    default:
      return Math.random() * 2 + 0.5; // Scale between 0.5 and 2.5
  }
};

// Returns different color values based on the transition mode
const getParticleColor = (mode: ParticlesTransitionMode, baseColor: string): THREE.Color => {
  //if (mode === 'wrapped') return new THREE.Color(baseColor);
  if (mode === 'full-screen') return new THREE.Color(baseColor);
  return new THREE.Color(Math.random() * 0xffffff);
};

/**
 * @summary Filter the particles, returns if the particle is valid.
 * @param particle the particle properties
 * @param radius2 the pow(radius, 2) of the border
 */
const isValidParticle = (
  mode: ParticlesTransitionMode,
  particle: ParticleProperties,
  radius2: number,
): boolean => {
  if (mode !== 'wrapped') return true;
  return true;
  // Avoid sqrt for speed
  return particle.position.x ** 2 + particle.position.y ** 2 < radius2;
};

const generateParticlesProperties = (
  numbers: number,
  mode: ParticlesTransitionMode,
  size: Size,
  baseColor: string,
): ParticleProperties[] => {
  const particles: ParticleProperties[] = [];
  // Used for isValidParticle, pre-calculate for performance
  const radius2 = (Math.min(size.width, size.height) * 0.8) ** 2;

  for (let i = 0; i < numbers; i++) {
    // Generate random properties for each particle
    const position = new THREE.Vector3(
      Math.random() * 100 - 50,
      Math.random() * 60 - 30,
      Math.random() * 80 - 40,
    );
    const rotation = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );

    const scale = getParticleScale(mode);

    const color = getParticleColor(mode, baseColor);

    const particle: ParticleProperties = {
      position,
      rotation,
      scale,
      color,
    };

    // Only add particles that pass the filter based on the mode
    if (isValidParticle(mode, particle, radius2)) particles.push(particle);
  }
  return particles;
};

// This component is a part of the transition effect, which generates particles
const ParticlesTransition = ({
  numbers,
  mode,
  baseColor,
  active,
}: {
  numbers: number;
  mode: ParticlesTransitionMode;
  baseColor: string;
  active: boolean;
}) => {
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const renderTarget = useRef<THREE.WebGLRenderTarget>(
    new THREE.WebGLRenderTarget(size.width, size.height),
  );

  // Generate particles based on the numbers, mode and size
  useEffect(() => {
    console.log('Generating particles...', numbers, mode, size);
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const particlesProps = generateParticlesProperties(numbers, mode, size, baseColor);
    console.log(`Generated ${particlesProps.length} particles`);
    for (let i = 0; i < particlesProps.length; i++) {
      dummy.position.copy(particlesProps[i].position);
      dummy.rotation.copy(particlesProps[i].rotation);
      dummy.scale.setScalar(particlesProps[i].scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, getParticleColor(mode, baseColor)); // Default color, will be updated below
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [baseColor, mode, numbers, size]);

  // Update the render target size when the canvas size changes
  useEffect(() => {
    renderTarget.current.setSize(size.width, size.height);
  }, [size]);

  // The animation loop, disabled when not active
  useFrame((state, delta) => {
    if (!active) return; // Skip the animation if not active
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, numbers]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial flatShading />
      </instancedMesh>
    </group>
  );
};

/**
 * @summary ParticlesTransition component
 * @description
 * This component is inspired by https://github.com/bobbyroe/transition-effect.
 * I ported it to React-Three-Fiber and modified to fit the needs of the project.
 *
 * This component generates bunch of particles, and performs a transition effect
 * periodically and on hover.
 * The effect is active only when the component is in view for performance reasons.
 * But I don't unmount it since the loading may also be expensive.
 *
 * @param - numbers - The number of particles to generate.
 * @param - mode - Shows in section hero, or in a standalone page.
 */
const ParticlesTransitionComp = ({
  numbers,
  baseColor,
  mode,
}: {
  numbers: number;
  baseColor: string;
  mode: ParticlesTransitionMode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px' });
  console.log(mode, isInView);

  return (
    <motion.div
      ref={ref}
      className='absolute inset-0 z-[-1]'
      data-role='particles-transition'
      aria-hidden='true'
      {...fadeInAnimation}
    >
      <Canvas className='h-full w-full'>
        <PerspectiveCamera makeDefault position={[0, 0, 100]} near={1} far={1000} fov={50} />
        <ambientLight />
        <directionalLight position={[10, 10, 10]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <ParticlesTransition numbers={numbers} baseColor={baseColor} mode={mode} active={true} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default ParticlesTransitionComp;
