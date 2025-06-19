import { Dispatch, SetStateAction, Suspense, useEffect, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { Canvas, Size } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

import { fadeInAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

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
      return Math.random() * 200 + 100; // Scale between 0.5 and 2.5
  }
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

// Generates the particles properties based on the numbers, mode, size and base color
const generateParticlesProperties = (
  numbers: number,
  mode: ParticlesTransitionMode,
  size: Size,
): ParticleProperties[] => {
  const particles: ParticleProperties[] = [];
  // Used for isValidParticle, pre-calculate for performance
  const radius2 = (Math.min(size.width, size.height) * 0.8) ** 2;

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

    const scale = getParticleScale(mode);

    const color = new THREE.Color(Math.random() * 0xffffff);

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
  active,
}: {
  numbers: number;
  mode: ParticlesTransitionMode;
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
    const particlesProps = generateParticlesProperties(numbers, mode, size);
    console.log(`Generated ${particlesProps.length} particles`);
    for (let i = 0; i < particlesProps.length; i++) {
      dummy.position.copy(particlesProps[i].position);
      dummy.rotation.copy(particlesProps[i].rotation);
      dummy.scale.setScalar(particlesProps[i].scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, particlesProps[i].color); // Default color, will be updated below
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [mode, numbers, size]);

  // Update the render target size when the canvas size changes
  useEffect(() => {
    renderTarget.current.setSize(size.width, size.height);
  }, [size]);

  // The animation loop, disabled when not active
  useFrame((_state, delta) => {
    if (!active || !groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, numbers]}>
        <icosahedronGeometry args={[0.25, 1]} />
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
 */
const ParticlesTransitionComp = ({
  mode,
  setParticlesMode,
}: {
  mode: ParticlesTransitionMode;
  setParticlesMode: Dispatch<SetStateAction<ParticlesTransitionMode>>;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px 0px' });
  setParticlesMode(mode);

  const numbers = mode === 'wrapped' ? 1000 : 1000; // Adjust numbers based on mode
  const position =
    mode === 'wrapped' ? new THREE.Vector3(0, 0, 30000) : new THREE.Vector3(0, 0, 80000);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'absolute top-6 right-4 z-0 aspect-square w-1/4 lg:top-auto lg:right-0 lg:bottom-10 lg:w-1/6',
      )}
      data-role='particles-transition'
      aria-hidden='true'
      {...fadeInAnimation}
    >
      <Canvas className='h-100 w-100'>
        <Suspense fallback={<div className='absolute inset-0 z-0 bg-black' />}>
          <PerspectiveCamera makeDefault position={position} near={1} far={100000} fov={20} />
          <ambientLight intensity={0.15} />
          <hemisphereLight args={[0x0099ff, 0xaa5500, 0.4]} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} />
          <ParticlesTransition numbers={numbers} mode={mode} active={isInView} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default ParticlesTransitionComp;

export type { ParticlesTransitionMode };
