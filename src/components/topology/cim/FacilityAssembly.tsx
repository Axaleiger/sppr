import type { NodeKind } from '../../../data/topology'
import { mat, pipeMat } from './materials'
import { WellClusterPad } from './DetailedWell'
import {
  BlockBuilding,
  Foundation,
  FlareStack,
  Handrail,
  HorizontalPipe,
  HorizontalVessel,
  PipeRackBay,
  PumpSkid,
  StairTower,
  StorageTank,
  TransformerYard,
  VerticalVessel,
} from './Primitives'

/** Restored visual detail — network stays large, meshes stay sensible */
export function FacilityAssembly({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case 'wells':
    case 'cluster':
      return <WellClusterPad count={3} />

    case 'upn':
    case 'dns':
    case 'cppn':
      return (
        <group>
          <Foundation w={6.2} d={4.8} h={0.14} />
          <StorageTank radius={0.95} height={1.55} position={[-2.0, 0, -1.1]} />
          <StorageTank radius={0.75} height={1.3} position={[-1.9, 0, 1.2]} />
          <VerticalVessel radius={0.36} height={2.1} position={[0.4, 0, -1.2]} />
          <VerticalVessel
            radius={0.28}
            height={1.7}
            position={[1.3, 0, -1.25]}
            color={mat.insulation as string}
          />
          <HorizontalVessel length={2.1} radius={0.32} position={[0.5, 0, 0.7]} />
          <BlockBuilding w={2.1} h={1.4} d={1.55} position={[2.1, 0, 1.2]} />
          <PumpSkid position={[1.6, 0, -0.15]} />
          <PumpSkid position={[1.6, 0, 0.55]} />
          <PipeRackBay
            length={5}
            height={1.55}
            width={1.15}
            position={[0.1, 0, 2.15]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.oil, pipeMat.oil, pipeMat.gas, pipeMat.water]}
          />
          <StairTower height={2.3} position={[2.5, 0, -1.4]} />
          {kind === 'upn' && <FlareStack position={[3.0, 0, -2.0]} />}
          <Handrail length={5.5} position={[0, 0.08, -2.3]} />
        </group>
      )

    case 'ukpg':
    case 'ks':
      return (
        <group>
          <Foundation w={5.2} d={4} h={0.14} />
          <HorizontalVessel length={2.3} radius={0.36} position={[-1.4, 0, -0.7]} />
          <HorizontalVessel
            length={1.9}
            radius={0.3}
            position={[-1.2, 0, 0.85]}
            color={mat.insulation as string}
          />
          <VerticalVessel radius={0.42} height={2.3} position={[1.15, 0, -0.85]} />
          <BlockBuilding w={1.7} h={1.35} d={1.35} position={[1.6, 0, 1.2]} />
          <PumpSkid position={[0.1, 0, 1.35]} />
          <PipeRackBay
            length={4.2}
            height={1.5}
            width={1.05}
            position={[0, 0, 1.9]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.gas, pipeMat.air, pipeMat.water]}
          />
        </group>
      )

    case 'gtes':
      return (
        <group>
          <Foundation w={5} d={3.6} h={0.16} />
          <BlockBuilding w={3.2} h={1.8} d={2.2} />
          <mesh position={[0, 1.2, -1.6]} castShadow>
            <boxGeometry args={[2.5, 1.6, 1.05]} />
            <meshStandardMaterial color={mat.building} metalness={0.1} roughness={0.75} />
          </mesh>
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 2.9, -1.6]} castShadow>
              <cylinderGeometry args={[0.15, 0.19, 2.0, 10]} />
              <meshStandardMaterial color={mat.steel} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          <TransformerYard position={[2.4, 0, 0.3]} />
          <PipeRackBay
            length={3.6}
            height={1.35}
            width={0.95}
            position={[0, 0, 1.85]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.water, pipeMat.power]}
          />
        </group>
      )

    case 'vl':
    case 'ps':
      return (
        <group>
          <Foundation w={3.6} d={3} />
          <TransformerYard />
          {[-1.35, 1.35].map((x) => (
            <group key={x} position={[x, 0, -1.2]}>
              <mesh position={[0, 2.2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.11, 4.4, 5]} />
                <meshStandardMaterial color={mat.steelDark} metalness={0.65} roughness={0.35} />
              </mesh>
              {[1.2, 2.3, 3.4].map((y) => (
                <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <boxGeometry args={[1.2, 0.045, 0.045]} />
                  <meshStandardMaterial color={mat.steel} metalness={0.6} roughness={0.35} />
                </mesh>
              ))}
            </group>
          ))}
          <HorizontalPipe length={2.9} color={pipeMat.power} radius={0.025} position={[0, 3.3, -1.2]} />
          <HorizontalPipe length={2.9} color={pipeMat.power} radius={0.025} position={[0, 3.9, -1.2]} />
        </group>
      )

    case 'phg':
      return (
        <group>
          <Foundation w={4.6} d={3.6} />
          <StorageTank radius={1.15} height={1.15} position={[-1.0, 0, 0]} />
          <VerticalVessel radius={0.45} height={1.25} position={[1.35, 0, -0.6]} legs={false} />
          <BlockBuilding w={1.4} h={1.1} d={1.15} position={[1.35, 0, 1.15]} />
          <PipeRackBay
            length={3.6}
            height={1.3}
            width={0.95}
            position={[0, 0, 1.8]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.gas, pipeMat.water]}
          />
        </group>
      )

    case 'plast':
      return (
        <group>
          <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[5, 0.75, 3.6]} />
            <meshStandardMaterial color={mat.plastDeep} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[4.5, 0.3, 3.2]} />
            <meshStandardMaterial color={mat.plast} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[4, 0.22, 2.8]} />
            <meshStandardMaterial color="#6A8F7A" roughness={0.85} />
          </mesh>
          {[-1.4, -0.45, 0.45, 1.4].map((x) => (
            <mesh key={x} position={[x, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 1.7, 6]} />
              <meshStandardMaterial color={mat.steelDark} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          <Handrail length={3.8} position={[0, 0.45, 1.55]} />
        </group>
      )

    case 'pns':
      return (
        <group>
          <Foundation w={3.6} d={2.8} />
          <PumpSkid position={[-0.7, 0, 0]} />
          <PumpSkid position={[0.7, 0, 0]} />
          <BlockBuilding w={1.3} h={1.1} d={1.1} position={[1.35, 0, 1.1]} />
          <PipeRackBay
            length={3.2}
            height={1.3}
            width={0.9}
            position={[0, 0, -1.25]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.water, pipeMat.oil, pipeMat.water]}
          />
        </group>
      )

    case 'external':
      return (
        <group>
          <Foundation w={2.8} d={2.2} />
          <BlockBuilding w={2.2} h={1.4} d={1.6} />
        </group>
      )

    default:
      return (
        <group>
          <Foundation w={3.2} d={2.6} />
          <BlockBuilding w={1.9} h={1.25} d={1.45} />
          <VerticalVessel radius={0.3} height={1.6} position={[1.35, 0, -0.55]} />
        </group>
      )
  }
}
