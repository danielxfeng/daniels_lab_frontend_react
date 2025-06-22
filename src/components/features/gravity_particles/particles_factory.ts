import * as THREE from 'three';

const ParticleMaterialEnum = ['plastic', 'metal', 'phong'] as const;
type ParticleMaterial = (typeof ParticleMaterialEnum)[number];

type ParticleProps = {
  color: THREE.Color;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  currRotation: THREE.Euler;
  isHovered: boolean;
  hoverColor: THREE.Color;
  hoverScale?: number;
  velocity?: THREE.Vector3;
};

type ParticleMeshContainer = {
  size: number;
  particlePropsArr: ParticleProps[];
  instance: THREE.InstancedMesh;
};

// A map of material and it's container
type ParticleMeshes = Record<ParticleMaterial, ParticleMeshContainer>;

// Distribution of particle materials
const distribution: Record<ParticleMaterial, number> = {
  phong: 0.3,
  plastic: 0.3,
  metal: 0.4,
};

// The size factor for different material
const scaleFactors: Record<ParticleMaterial, number> = {
  plastic: 1,
  metal: 0.8,
  phong: 0.9,
};

// Returns an array of particle props.
const particlePropsFactory = (size: number, material: ParticleMaterial): ParticleProps[] => {
  const particles: ParticleProps[] = [];

  // Scale scope is vary depends on material.
  const scaleFactor = scaleFactors[material];
  for (let i = 0; i < size; i++) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const rotation = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );
    const particle: ParticleProps = {
      color,
      position: new THREE.Vector3(
        Math.random() * 10000 - 5000,
        Math.random() * 10000 - 5000,
        Math.random() * 10000 - 5000,
      ),
      rotation,
      currRotation: rotation.clone(),
      scale: (Math.random() * 200 + 100) * scaleFactor,
      hoverColor: color.clone().lerp(new THREE.Color('white'), 0.2),
      isHovered: false,
    };
    particles.push(particle);
  }
  return particles;
};

// Returns an InstanceMesh
const instanceFactory = (
  material: ParticleMaterial,
  particlePropsArr: ParticleProps[],
): THREE.InstancedMesh => {
  const count = particlePropsArr.length;

  // Defines the shape
  let geometry: THREE.BufferGeometry;
  switch (material) {
    case 'metal':
      geometry = new THREE.IcosahedronGeometry(0.25, 1);
      break;
    case 'plastic':
      geometry = new THREE.IcosahedronGeometry(0.25, 1);
      break;
    case 'phong':
      geometry = new THREE.IcosahedronGeometry(0.25, 2);
      break;
    default:
      geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25); // should not be here!
  }

  // Defines the material
  let meshMaterial = new THREE.Material();
  switch (material) {
    case 'phong':
      meshMaterial = new THREE.MeshPhongMaterial({
        flatShading: true,
        shininess: 100,
        specular: new THREE.Color(0xaaaaaa),
      });
      break;
    case 'metal':
      meshMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.8,
        roughness: 0.6,
        flatShading: true,
      });
      break;
    case 'plastic':
      meshMaterial = new THREE.MeshStandardMaterial({
        flatShading: true,
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color(0x335577),
        emissiveIntensity: 1.3,
      });
      break;
    default:
      meshMaterial = new THREE.MeshStandardMaterial(); // Should not be here
  }

  // Create mesh
  const instancedMesh = new THREE.InstancedMesh(geometry, meshMaterial, count);
  // instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);

  // Assign the particle-level properties by a dummy.
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    dummy.position.copy(particlePropsArr[i].position);
    dummy.rotation.copy(particlePropsArr[i].rotation);
    dummy.scale.setScalar(particlePropsArr[i].scale);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    instancedMesh.setColorAt(i, particlePropsArr[i].color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.instanceColor!.needsUpdate = true;

  return instancedMesh;
};

// A factory to build the prop for a mesh, which is divided by it's material
const particlesContainerFactory = (
  material: ParticleMaterial,
  size: number,
): ParticleMeshContainer => {
  const particlePropsArr: ParticleProps[] = particlePropsFactory(size, material);
  return {
    size,
    particlePropsArr,
    instance: instanceFactory(material, particlePropsArr),
  };
};

/**
 * @summary A factory to build the ParticleMeshes by given count.
 * @return  A map: { material : { size, [particleProps], InstancedMesh } }
 * key:
 *  - material: type of a particle mesh.
 * value:
 *  - meshContainer: the container of a mesh.
 *    - size: the numbers of particles in the mesh.
 *    - ParticleProps[]: the array of a custom data structure for a mesh.
 *    - InstanceMesh: a container in three.js, which defines a group of particles,
 *      that can be rendered by GPU as a batch.
 */
const particlesFactory = (count: number): ParticleMeshes => {
  const particleMeshes: ParticleMeshes = {} as ParticleMeshes;
  for (const material of ParticleMaterialEnum) {
    particleMeshes[material] = particlesContainerFactory(
      material,
      Math.floor(count * distribution[material]),
    );
  }
  return particleMeshes;
};

export { ParticleMaterialEnum };
export default particlesFactory;

export type { ParticleMaterial, ParticleMeshes };
