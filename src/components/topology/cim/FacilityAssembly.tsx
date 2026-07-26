import type { NodeKind } from '../../../data/topology'
import { mat, pipeMat } from './materials'
import { WellClusterPad } from './DetailedWell'
import {
  BlockBuilding,
  Foundation,
  HorizontalPipe,
  HorizontalVessel,
  PipeRackBay,
  PumpSkid,
  StorageTank,
  TransformerYard,
  VerticalVessel,
} from './Primitives'

/** Medium-detail assemblies — fewer meshes, BasicMaterial where possible via simplified primitives */
export function FacilityAssembly({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case 'wells':
    case 'cluster':
      return <WellClusterPad count={2} />

    case 'upn':
    case 'dns':
    case 'cppn':
      return (
        <group>
          <Foundation w={5.5} d={4} h={0.12} />
          <StorageTank radius={0.85} height={1.4} position={[-1.6, 0, -0.8]} />
          <VerticalVessel radius={0.32} height={1.8} position={[0.6, 0, -1]} />
          <HorizontalVessel length={1.8} radius={0.28} position={[0.4, 0, 0.8]} />
          <BlockBuilding w={1.8} h={1.2} d={1.4} position={[1.8, 0, 1.1]} />
          <PumpSkid position={[1.4, 0, -0.2]} />
          <PipeRackBay
            length={4}
            height={1.4}
            width={0.9}
            position={[0, 0, 1.9]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.oil, pipeMat.gas, pipeMat.water]}
          />
        </group>
      )

    case 'ukpg':
    case 'ks':
      return (
        <group>
          <Foundation w={4.5} d={3.5} h={0.12} />
          <HorizontalVessel length={2} radius={0.32} position={[-1.1, 0, -0.5]} />
          <VerticalVessel radius={0.38} height={2} position={[1.1, 0, -0.6]} />
          <BlockBuilding w={1.5} h={1.2} d={1.2} position={[1.3, 0, 1.1]} />
          <PipeRackBay
            length={3.5}
            height={1.3}
            width={0.85}
            position={[0, 0, 1.7]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.gas, pipeMat.water]}
          />
        </group>
      )

    case 'gtes':
      return (
        <group>
          <Foundation w={4} d={3} h={0.14} />
          <BlockBuilding w={2.8} h={1.6} d={2} />
          <mesh position={[-0.5, 2.4, -0.9]}>
            <cylinderGeometry args={[0.14, 0.18, 1.6, 8]} />
            <meshBasicMaterial color={mat.steel} />
          </mesh>
          <mesh position={[0.5, 2.4, -0.9]}>
            <cylinderGeometry args={[0.14, 0.18, 1.6, 8]} />
            <meshBasicMaterial color={mat.steel} />
          </mesh>
          <TransformerYard position={[2, 0, 0.2]} />
        </group>
      )

    case 'vl':
    case 'ps':
      return (
        <group>
          <Foundation w={3} d={2.5} />
          <TransformerYard />
          {[-1.2, 1.2].map((x) => (
            <mesh key={x} position={[x, 2, -1]}>
              <cylinderGeometry args={[0.05, 0.1, 4, 5]} />
              <meshBasicMaterial color={mat.steelDark} />
            </mesh>
          ))}
          <HorizontalPipe length={2.6} color={pipeMat.power} radius={0.025} position={[0, 3.2, -1]} />
        </group>
      )

    case 'phg':
      return (
        <group>
          <Foundation w={4} d={3.2} />
          <StorageTank radius={1.1} height={1.1} position={[-0.8, 0, 0]} />
          <BlockBuilding w={1.3} h={1} d={1.1} position={[1.4, 0, 1]} />
        </group>
      )

    case 'plast':
      return (
        <group>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[4.5, 0.7, 3.2]} />
            <meshBasicMaterial color={mat.plastDeep} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[4, 0.3, 2.8]} />
            <meshBasicMaterial color={mat.plast} />
          </mesh>
          {[-1.2, 0, 1.2].map((x) => (
            <mesh key={x} position={[x, 0.7, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 1.5, 5]} />
              <meshBasicMaterial color={mat.steelDark} />
            </mesh>
          ))}
        </group>
      )

    case 'pns':
      return (
        <group>
          <Foundation w={3.2} d={2.5} />
          <PumpSkid position={[-0.6, 0, 0]} />
          <PumpSkid position={[0.7, 0, 0]} />
          <BlockBuilding w={1.2} h={1} d={1} position={[1.2, 0, 1]} />
        </group>
      )

    case 'external':
      return (
        <group>
          <Foundation w={2.5} d={2} />
          <BlockBuilding w={2} h={1.3} d={1.5} />
        </group>
      )

    default:
      return (
        <group>
          <Foundation w={3} d={2.5} />
          <BlockBuilding w={1.8} h={1.2} d={1.4} />
          <VerticalVessel radius={0.28} height={1.5} position={[1.3, 0, -0.5]} />
        </group>
      )
  }
}
