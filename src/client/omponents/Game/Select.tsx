import React, { ChangeEvent, VFC } from 'react'

type PropsType = {
  className: string
  value: number | string
  items: { value: string; name: string }[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => unknown
}

const Select: VFC<PropsType> = ({ className, value, items, onChange }) => {
  return (
    <select value={value} className={className} onChange={onChange}>
      {items.map(({ name, value }) => (
        <option value={value} key={value}>
          {name}
        </option>
      ))}
    </select>
  )
}

export default Select
