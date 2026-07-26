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
  Column,
  IBeam,
} from './Primitives'

export function FacilityAssembly({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case 'wells':
    case 'cluster':
      return <WellClusterPad count={4} withPumpjack />

    case 'upn':
    case 'dns':
    case 'cppn':
      return (
        <group>
          <Foundation w={7.5} d={5.5} h={0.16} />
          <StorageTank radius={1.0} height={1.8} position={[-2.4, 0, -1.2]} />
          <StorageTank radius={0.85} height={1.5} position={[-2.2, 0, 1.5]} />
          <VerticalVessel radius={0.4} height={2.4} position={[0.2, 0, -1.4]} />
          <VerticalVessel
            radius={0.32}
            height={1.9}
            position={[1.3, 0, -1.5]}
            color={mat.insulation as string}
          />
          <HorizontalVessel length={2.4} radius={0.38} position={[0.6, 0, 0.6]} />
          <BlockBuilding w={2.4} h={1.6} d={1.8} position={[2.4, 0, 1.4]} />
          <PumpSkid position={[1.8, 0, -0.2]} />
          <PumpSkid position={[1.8, 0, 0.7]} />
          <PipeRackBay
            length={5.5}
            height={1.8}
            width={1.3}
            position={[0.2, 0, 2.4]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.oil, pipeMat.oil, pipeMat.gas, pipeMat.water, pipeMat.steam]}
          />
          <StairTower height={2.6} position={[2.8, 0, -1.6]} />
          <FlareStack position={[3.4, 0, -2.2]} />
          <Handrail length={6} position={[0, 0.1, -2.6]} />
        </group>
      )

    case 'ukpg':
    case 'ks':
      return (
        <group>
          <Foundation w={6.5} d={4.8} h={0.16} />
          <HorizontalVessel length={2.8} radius={0.42} position={[-1.6, 0, -0.8]} />
          <HorizontalVessel length={2.4} radius={0.36} position={[-1.4, 0, 0.9]} color={mat.insulation as string} />
          <VerticalVessel radius={0.5} height={2.6} position={[1.0, 0, -1.0]} />
          <VerticalVessel radius={0.35} height={2.0} position={[2.0, 0, -0.9]} />
          <BlockBuilding w={2.0} h={1.5} d={1.6} position={[2.0, 0, 1.4]} />
          <PumpSkid position={[0.2, 0, 1.5]} />
          <PipeRackBay
            length={5}
            height={1.7}
            width={1.2}
            position={[0, 0, 2.2]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.gas, pipeMat.air, pipeMat.water]}
          />
          <Column height={3.2} position={[-2.8, 0, 1.8]} />
          <Column height={3.2} position={[-2.8, 0, -1.8]} />
          <IBeam length={3.8} position={[-2.8, 3.2, 0]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      )

    case 'gtes':
      return (
        <group>
          <Foundation w={5.5} d={4} h={0.18} />
          <BlockBuilding w={3.6} h={2.0} d={2.4} position={[0, 0, 0]} />
          {/* turbine hall annex */}
          <mesh position={[0, 1.3, -1.8]} castShadow>
            <boxGeometry args={[2.8, 1.8, 1.2]} />
            <meshStandardMaterial color={mat.building} metalness={0.1} roughness={0.75} />
          </mesh>
          <mesh position={[0, 2.3, -1.8]} castShadow>
            <boxGeometry args={[3.0, 0.15, 1.4]} />
            <meshStandardMaterial color={mat.buildingRoof} metalness={0.4} roughness={0.45} />
          </mesh>
          {/* exhaust stacks */}
          {[-0.6, 0.6].map((x) => (
            <mesh key={x} position={[x, 3.2, -1.8]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 2.4, 14]} />
              <meshStandardMaterial color={mat.steel} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          <TransformerYard position={[2.6, 0, 0.4]} />
          <PipeRackBay
            length={4}
            height={1.5}
            width={1.0}
            position={[-0.2, 0, 2.0]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.water, pipeMat.power]}
          />
        </group>
      )

    case 'vl':
    case 'ps':
      return (
        <group>
          <Foundation w={4} d={3.5} />
          <TransformerYard position={[0, 0, 0]} />
          {/* transmission towers */}
          {[-1.6, 1.6].map((x) => (
            <group key={x} position={[x, 0, -1.4]}>
              <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.14, 5, 6]} />
                <meshStandardMaterial color={mat.steelDark} metalness={0.65} roughness={0.35} />
              </mesh>
              {[1.2, 2.4, 3.6].map((y) => (
                <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <boxGeometry args={[1.4, 0.05, 0.05]} />
                  <meshStandardMaterial color={mat.steel} metalness={0.6} roughness={0.35} />
                </mesh>
              ))}
            </group>
          ))}
          <HorizontalPipe length={3.5} color={pipeMat.power} radius={0.025} position={[0, 3.5, -1.4]} />
          <HorizontalPipe length={3.5} color={pipeMat.power} radius={0.025} position={[0, 4.2, -1.4]} />
        </group>
      )

    case 'phg':
      return (
        <group>
          <Foundation w={5} d={4} />
          <StorageTank radius={1.3} height={1.2} position={[-1.2, 0, 0]} />
          <VerticalVessel radius={0.55} height={1.4} position={[1.5, 0, -0.8]} legs={false} />
          <BlockBuilding w={1.6} h={1.2} d={1.3} position={[1.5, 0, 1.3]} />
          <PipeRackBay
            length={4}
            height={1.4}
            width={1.0}
            position={[0, 0, 2.0]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.gas, pipeMat.gas, pipeMat.water]}
          />
          {/* underground hint */}
          <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 2.2, 40]} />
            <meshStandardMaterial color={mat.earth} transparent opacity={0.55} />
          </mesh>
        </group>
      )

    case 'plast':
      return (
        <group>
          <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.5, 0.9, 4]} />
            <meshStandardMaterial color={mat.plastDeep} roughness={0.95} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.05, 0]} castShadow>
            <boxGeometry args={[5.2, 0.35, 3.7]} />
            <meshStandardMaterial color={mat.plast} roughness={0.9} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[4.6, 0.25, 3.2]} />
            <meshStandardMaterial color="#6A8F7A" roughness={0.85} metalness={0.05} />
          </mesh>
          {/* wellbores into reservoir */}
          {[-1.5, -0.5, 0.5, 1.5].map((x) => (
            <mesh key={x} position={[x, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
              <meshStandardMaterial color={mat.steelDark} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          <Handrail length={4} position={[0, 0.5, 1.7]} />
        </group>
      )

    case 'pns':
      return (
        <group>
          <Foundation w={4} d={3} />
          <PumpSkid position={[-0.8, 0, 0]} />
          <PumpSkid position={[0.6, 0, 0]} />
          <BlockBuilding w={1.5} h={1.2} d={1.2} position={[1.4, 0, 1.2]} />
          <PipeRackBay
            length={3.5}
            height={1.4}
            width={1.0}
            position={[0, 0, -1.4]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.water, pipeMat.oil, pipeMat.water]}
          />
        </group>
      )

    case 'arm':
      return (
        <group>
          <BlockBuilding w={2.8} h={1.8} d={2.0} />
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[0.8, 0.5, 0.6]} />
            <meshStandardMaterial color={mat.steel} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      )

    default:
      return (
        <group>
          <Foundation w={3.5} d={3} />
          <BlockBuilding w={2.2} h={1.5} d={1.8} />
          <VerticalVessel radius={0.35} height={1.8} position={[1.5, 0, -0.8]} />
          <PipeRackBay
            length={3}
            height={1.4}
            width={0.9}
            position={[0, 0, 1.6]}
            rotationY={Math.PI / 2}
            pipes={[pipeMat.oil, pipeMat.gas]}
          />
        </group>
      )
  }
}
