import type { ReactNode } from 'react'
import { BoxCar } from '../sections/bnsf/cars/BoxCar'
import { FlatCar } from '../sections/bnsf/cars/FlatCar'
import { HopperCar } from '../sections/bnsf/cars/HopperCar'
import { TankCar } from '../sections/bnsf/cars/TankCar'
import { WellCar } from '../sections/bnsf/cars/WellCar'
import { Locomotive } from '../sections/bnsf/Locomotive'
import { Kit, Office, Parked } from './stands'

// The models shown in the gallery. Add an entry when a model is built or
// reworked so it can be reviewed on its own.

export interface GalleryModel {
  id: string
  label: string
  /** Scale and height that centre the model in the gallery's view. */
  scale?: number
  y?: number
  render: () => ReactNode
}

export const models: GalleryModel[] = [
  { id: 'kit', label: 'Shape kit', scale: 0.75, y: 0.5, render: () => <Kit /> },
  {
    id: 'locomotive',
    label: 'Locomotive',
    scale: 1.3,
    y: -0.8,
    render: () => (
      <Parked vehicle={({ motion }) => <Locomotive motion={motion} />} />
    ),
  },
  {
    id: 'hopper',
    label: 'Hopper car',
    scale: 1.6,
    y: -1,
    render: () => <Parked vehicle={HopperCar} />,
  },
  {
    id: 'well',
    label: 'Well car',
    scale: 1.6,
    y: -1,
    render: () => <Parked vehicle={WellCar} />,
  },
  {
    id: 'box',
    label: 'Boxcar',
    scale: 1.6,
    y: -1,
    render: () => <Parked vehicle={BoxCar} />,
  },
  {
    id: 'flat',
    label: 'Flat car',
    scale: 1.6,
    y: -1,
    render: () => <Parked vehicle={FlatCar} />,
  },
  {
    id: 'tank',
    label: 'Tank car',
    scale: 1.6,
    y: -1,
    render: () => <Parked vehicle={TankCar} />,
  },
  {
    id: 'office',
    label: 'Records office',
    scale: 0.8,
    render: () => <Office />,
  },
]
