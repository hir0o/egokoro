import { FC, useCallback, useContext, useEffect, useState } from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketOn } from '../utils/socket'
import { SocketContext } from '../App'
const initialMessage = [
  {
    name: 'ユーザー1',
    text: 'わああ'
  },
  {
    name: 'ユーザー2',
    text: 'やああ'
  },
  {
    name: 'announce',
    text: 'ゲームを開始します．'
  },
  {
    name: 'ユーザー3',
    text: 'ぐああ'
  },
  {
    name: 'announce',
    text: '正解です！'
  }
]

const Chat: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessage)
  const socket = useContext(SocketContext)

  useEffect(() => {
    socketOn<MessageType>(socket, 'chat', (payload) => {
      setMessages((prev) => [
        ...prev,
        { name: payload.name, text: payload.text }
      ])
    })
  }, [socket])

  return (
    <>
      <MessageList messages={messages} />
      <ChatForm setMessages={setMessages} />
    </>
  )
}

export default Chat
