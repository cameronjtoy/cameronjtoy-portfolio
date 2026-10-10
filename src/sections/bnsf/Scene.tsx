import { useFrame } from '@react-three/fiber'
import { useRef, type ComponentType } from 'react'
import type { Group } from 'three'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import { BoxCar } from './cars/BoxCar'
import { FlatCar } from './cars/FlatCar'
import { HopperCar } from './cars/HopperCar'
import { TankCar } from './cars/TankCar'
import { WellCar } from './cars/WellCar'
import { cars } from './cars'
import { Locomotive } from './Locomotive'
import { clamp01 } from '../../design/math'
import { type CarProps, type TrainMotion } from './parts'
import { Scenery } from './Scenery'
import { carCenter, trainX } from './timeline'

// A train passes right to left as the section scrolls: a locomotive, then one
// car per resume highlight. Each car plays its own small animation as it
// arrives at the centre of the screen.

const TRACK_Y = -1.9 // lower part of the view; the cards sit above
/** A car starts its animation this far right of centre and finishes at centre. */
const REVEAL_FROM = 3.2
/** The scene is designed for a view this wide and shrinks to fit narrower ones. */
const DESIGN_WIDTH = 7.5
const MIN_SCALE = 0.5

const carComponents: Record<
  (typeof cars)[number]['kind'],
  ComponentType<CarProps>
> = {
  hopper: HopperCar,
  well: WellCar,
  box: BoxCar,
  flat: FlatCar,
  tank: TankCar,
}

export default function BnsfScene({ id }: SceneProps) {
  const root = useRef<Group>(null)
  const train = useRef<Group>(null)
  const motion = useRef<TrainMotion>({ x: 0, reveal: cars.map(() => 0) })

  useFrame(({ viewport }) => {
    const x = trainX(getSection(id).progress)
    motion.current.x = x
    cars.forEach((_, index) => {
      const fromCentre = x + carCenter(index)
      motion.current.reveal[index] = clamp01(1 - fromCentre / REVEAL_FROM)
    })

    if (train.current) train.current.position.x = x
    root.current?.scale.setScalar(
      Math.min(1, Math.max(MIN_SCALE, viewport.width / DESIGN_WIDTH)),
    )
  })

  return (
    <group ref={root} position={[0, TRACK_Y, 0]}>
      <Scenery id={id} />
      <group ref={train}>
        <Locomotive motion={motion} />
        {cars.map((car, index) => {
          const Car = carComponents[car.kind]
          return (
            <group key={car.kind} position={[carCenter(index), 0, 0]}>
              <Car motion={motion} index={index} />
            </group>
          )
        })}
      </group>
    </group>
  )
}
