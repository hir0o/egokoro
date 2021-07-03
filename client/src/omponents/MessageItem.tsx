import { FC } from 'react'

type PropsType = {
  name: string
  text: string
}

const MessageItem: FC<PropsType> = ({ name, text }) => {
  return (
    <li>
      {name}: {text}
    </li>
  )
}

export default MessageItem
