import { VFC } from 'react'

type PropsType = {
  name: string
  text: string
}

const MessageItem: VFC<PropsType> = ({ name, text }) => {
  return (
    <li className={`border-b p-2 ${name === 'announce' && 'bg-green-200'} `}>
      {name}: {text}
    </li>
  )
}

export default MessageItem
