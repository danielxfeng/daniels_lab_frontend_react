import { Dispatch, SetStateAction, Suspense, useEffect, useMemo, useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { PerspectiveCamera } from '@react-three/drei';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

import particlesFactory, {
  ParticleMaterial,
  ParticleMaterialEnum,
  ParticleMeshes,
} from '@/components/features/gravity_particles/particles_factory';
import { fadeInAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

type GravityParticlesMode = 'container' | 'full-screen';

type PointerPosition = 'top' | 'bottom' | 'none';

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
  // hooks for three.
  const { gl, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const renderTarget = useRef<THREE.WebGLRenderTarget>(
    new THREE.WebGLRenderTarget(size.width, size.height),
  );
  const meshes = useRef<ParticleMeshes | null>(null);
  const meshRefs = useRef<Record<ParticleMaterial, THREE.InstancedMesh | null>>(
    Object.fromEntries(ParticleMaterialEnum.map((material) => [material, null])) as Record<
      ParticleMaterial,
      THREE.InstancedMesh | null
    >,
  );

  // for interaction.

  // To determine if the device support hover.
  const supportHover = typeof window !== 'undefined' && matchMedia('(hover: hover)').matches;
  const pointerPosRef = useRef<PointerPosition>('none');

  const hoverLock = useRef(false); // lock to prevent interaction during active animation
  const debouncedLock = useRef<NodeJS.Timeout | null>(null); // lock to prevent before hoverLock is set.
  const queuedHover = useRef<boolean | null>(null); // The un-executed operations during the lock, only last one is executed.

  const responsivePosition = useMemo(() => {
    return size.width > 768
      ? ([0, size.height * 0.1, 0] as [number, number, number])
      : ([0, size.height * 0.1, 0] as [number, number, number]);
  }, [size.width, size.height]);
  const responsiveScale = 0.03;

  const isMinimal = mode === 'full-screen' || isParticlesHover;

  const { scale, position } = useSpring({
    scale: isMinimal ? 1 : responsiveScale,
    position: isMinimal ? ([0, 0, 0] as [number, number, number]) : responsivePosition,

    onChange: () => {
      if (!hoverLock.current) hoverLock.current = true;
    },
    onRest: () => {
      hoverLock.current = false;
      if (queuedHover.current !== null && queuedHover.current !== isParticlesHover) {
        setIsParticlesHover(queuedHover.current);
        queuedHover.current = null;
      }
    },
    config: { tension: 120, friction: 30 },
  });

  // Generate meshes.
  useEffect(() => {
    meshes.current = particlesFactory(numbers);
  }, [numbers]);

  // Update the render target size when the canvas size changes
  useEffect(() => {
    renderTarget.current.setSize(size.width, size.height);
  }, [size]);

  // A simple interaction to change the rotation direction by the position of mouse.
  const directionRotationMap: Record<PointerPosition, [number, number]> = {
    top: [1, -1],
    bottom: [-1, -1],
    none: [1, 1],
  };

  // Rotate the particles group, pause when not active
  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;
    // Rotation effect
    const [xFactor, yFactor] = directionRotationMap[pointerPosRef.current];
    groupRef.current.rotation.x += delta * 0.1 * xFactor;
    groupRef.current.rotation.y += delta * 0.2 * yFactor;

    // Breath effect for plastic
    const plasticMesh = meshRefs.current.plastic;
    const plasticContainer = meshes.current?.plastic;
    if (!plasticMesh || !plasticContainer) return;
    const dummy = new THREE.Object3D();
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < plasticContainer.particlePropsArr.length; i++) {
      dummy.position.copy(plasticContainer.particlePropsArr[i].position);
      dummy.rotation.copy(plasticContainer.particlePropsArr[i].rotation);
      dummy.scale.setScalar(
        plasticContainer.particlePropsArr[i].scale * (1 + Math.sin(t * 2 + i) * 0.1),
      );
      dummy.updateMatrix();
      plasticMesh.setMatrixAt(i, dummy.matrix);
    }
    plasticMesh.instanceMatrix.needsUpdate = true;
    const plasticMat = plasticMesh.material as THREE.MeshStandardMaterial;
    plasticMat.emissiveIntensity = 1.3 * (1 + Math.sin(t * 2) * 0.3);
  });

  // A debounced toggle helper.
  const debouncedToggle = (value: boolean) => {
    if (debouncedLock.current) return;
    if (hoverLock.current && queuedHover.current !== value) {
      queuedHover.current = value;
      return;
    }
    debouncedLock.current = setTimeout(() => (debouncedLock.current = null), 50);
    if (!value) pointerPosRef.current = 'none';
    setIsParticlesHover(value);
  };

  // Start hover on pointer enter event.
  const pointerEnterHandler = () => {
    if (!supportHover || isParticlesHover) return;
    debouncedToggle(true);
  };

  // End hover on pointer leave event;
  const pointerLeaveHandler = () => {
    if (!supportHover || !isParticlesHover) return;
    debouncedToggle(false);
  };

  // onClink event.
  const pointerDownHandler = () => {
    if (supportHover || hoverLock.current) return;
    setIsParticlesHover((prev) => {
      if (prev) pointerPosRef.current = 'none';
      return !prev;
    });
  };

  // Set the position of mouse.
  const pointerMoveHandler = (e: ThreeEvent<PointerEvent>) => {
    if (!supportHover || !isParticlesHover || hoverLock.current) return;
    const canvasBounds = gl.domElement.getBoundingClientRect();
    const clientY = e.clientY - canvasBounds.top;

    const pointerPos: PointerPosition = clientY > canvasBounds.height / 2 ? 'top' : 'bottom';

    if (pointerPos != pointerPosRef.current) pointerPosRef.current = pointerPos;
  };

  // Clear on un-mount
  useEffect(() => {
    if (debouncedLock.current) {
      clearTimeout(debouncedLock.current);
      debouncedLock.current = null;
    }
  }, []);

  // To toggle visibility of the hover helper box
  const visibleHoverHelper = false;

  const helperBoxSize = isParticlesHover ? Math.max(size.width, size.height) * 1.5 : 10000;

  if (!meshes.current) return null;

  return (
    <animated.group ref={groupRef} scale={scale} position={position}>
      {/* The helper box for event handling. */}
      <mesh
        onPointerEnter={pointerEnterHandler} // Handle hover start (not work on mobile)
        onPointerMove={pointerMoveHandler} // Log the mouse position (not work on mobile)
        onPointerDown={pointerDownHandler} // Handle click to toggle hover state (works on non-hover device)
        onPointerLeave={pointerLeaveHandler} // Handle hover end (not work on mobile)
        visible={visibleHoverHelper} // Toggle visibility of the helper box(for debugging)
        frustumCulled={false}
      >
        <boxGeometry args={[helperBoxSize, helperBoxSize, helperBoxSize]} />
        <meshBasicMaterial color='red' transparent opacity={0.3} wireframe />
      </mesh>

      {/* Particles */}
      {ParticleMaterialEnum.map((material) => (
        <primitive
          key={material}
          ref={(ref: THREE.InstancedMesh | null) => {
            if (ref) meshRefs.current[material] = ref as THREE.InstancedMesh;
          }}
          object={meshes.current![material].instance}
        />
      ))}
    </animated.group>
  );
};

/**
 * @summary ParticlesTransition component
 * @description
 * The small toy was originally inspired by my mini-rt project developed at Hive Helsinki,
 * the project https://github.com/bobbyroe/transition-effect also provided a concrete example
 * and a helpful reference for how such effects can be implemented by Three.js.
 *
 * I ported them to React-Three-Fiber and modified to fit the project.
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

  const numbers = mode === 'container' ? 2000 : 5000; // Adjust numbers based on mode
  const position =
    mode === 'container'
      ? isParticlesHover
        ? new THREE.Vector3(0, 0, 2000)
        : new THREE.Vector3(0, 0, 5000)
      : new THREE.Vector3(0, 0, 3000);

  const animation = mode === 'container' ? fadeInAnimation : undefined;
  return (
    <motion.div
      ref={ref}
      className={cn('absolute h-full w-full', mode === 'container' && 'inset-0 z-50')}
      data-role='particles-transition'
      aria-hidden='true'
      {...animation}
    >
      <Canvas
        className='h-full w-full'
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
