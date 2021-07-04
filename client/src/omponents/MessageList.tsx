import { FC } from 'react'
import MessageItem from './MessageItem'
import { MessageType } from '../types'

type PropsType = {
  messages: MessageType[]
}

const MessageList: FC<PropsType> = ({ messages }) => {
  return (
    <ul className="border border-gray-400">
      {messages.map(({ name, text }, index) => (
        <MessageItem name={name} text={text} key={index} />
      ))}
    </ul>
  )
}

export default MessageList
