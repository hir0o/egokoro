import { FC, useContext, useEffect, useState } from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketOn } from '../utils/socket'
import { SocketContext } from '../App'

const Chat: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const socket = useContext(SocketContext)

  useEffect(() => {
    socketOn<MessageType>(socket, 'chat', (payload) => {
      setMessages((prev) => [
        ...prev,
        { name: payload.name, text: payload.text }
      ])
    })

    // アナウンス
    socketOn<{ [key: string]: string | number }>(
      socket,
      'announce',
      (payload) => {
        // ゲームの開始
        switch (payload.type) {
          case 'gameStart':
            setMessages((prev) => [
              ...prev,
              { name: 'announce', text: 'ゲームを開始します｡' },
              { name: 'announce', text: '' }
            ])
            break
          case 'gameEnd':
            break
          default:
            break
        }
        // ゲームの終了
      }
    )
  }, [socket])

  return (
    <>
      <MessageList messages={messages} />
      <ChatForm setMessages={setMessages} />
    </>
  )
}

export default Chat
