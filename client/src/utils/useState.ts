import { Dispatch, SetStateAction } from 'react'

export const setArrayValue = <T>(
  value: T,
  setValue: Dispatch<SetStateAction<T[]>>
) => setValue((prev) => [...prev, value])

// TODO: Obje
