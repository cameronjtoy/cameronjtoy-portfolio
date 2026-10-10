// How scroll progress maps to the train's position. Shared by the 3D scene
// and the DOM section so the card on screen always matches the car in view.
// Distances are in scene units; the train runs right to left along x and a
// car is "in view" when it is near x = 0.

export const CAR_COUNT = 5
export const LOCO_LENGTH = 3.6
export const CAR_LENGTH = 2.5
export const COUPLING_GAP = 0.3

const CAR_PITCH = CAR_LENGTH + COUPLING_GAP
/** Where the locomotive's centre sits when the section starts. */
const START_X = 2.5
/** How far past centre the last car has gone when the section ends. */
const TAIL_X = 4.5

/** A car's centre, measured back from the locomotive's centre. */
export function carCenter(index: number) {
  return LOCO_LENGTH / 2 + COUPLING_GAP + CAR_LENGTH / 2 + index * CAR_PITCH
}

const DISTANCE = START_X + carCenter(CAR_COUNT - 1) + TAIL_X

/** The locomotive's x position at a given scroll progress (0..1). */
export function trainX(progress: number) {
  return START_X - progress * DISTANCE
}

/** The scroll progress at which a car is exactly centred. */
export function carProgress(index: number) {
  return (START_X + carCenter(index)) / DISTANCE
}

/** The car currently in view, or -1 before the first and after the last. */
export function activeCar(progress: number) {
  const x = trainX(progress)
  for (let index = 0; index < CAR_COUNT; index++) {
    if (Math.abs(x + carCenter(index)) <= CAR_PITCH / 2) return index
  }
  return -1
}
