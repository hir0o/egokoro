import { Dispatch, SetStateAction } from 'react'

export const addArrayState = <T>(
  newValue: T,
  setValue: Dispatch<SetStateAction<T[]>>
) => setValue((prev) => [...prev, newValue])
