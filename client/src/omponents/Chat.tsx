import { FC, useContext, useEffect, useState } from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketEmit, socketOn } from '../utils/socket'
import { SocketContext, UserContext } from '../App'

const Chat: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  useEffect(() => {
    // 入室の送信
    socketEmit(socket, 'enter', '')

    // チャットの受診
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
            const isDraw = user.id === payload.drawUserId
            setMessages((prev) => [
              ...prev,
              { name: 'announce', text: 'ゲームを開始します｡' },
              {
                name: 'announce',
                text: isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡' // TODO: なんかもうちょいいい言い方
              }
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
  }, [socket, user])

  return (
    <>
      <MessageList messages={messages} />
      <ChatForm setMessages={setMessages} />
    </>
  )
}

export default Chat
