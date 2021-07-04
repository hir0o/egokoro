import { FC, useContext, useEffect, useState } from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketOn } from '../utils/socket'
import { SocketContext, UserContext } from '../App'

const Chat: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const socket = useContext(SocketContext)
  const { user, updateState } = useContext(UserContext)

  useEffect(() => {
    // チャットの受診
    socketOn<MessageType>(socket, 'chat', (payload) => {
      setMessages((prev) => [
        ...prev,
        { name: payload.name, text: payload.text }
      ])
    })

    socketOn<{ [key: string]: string | number }>(
      socket,
      'announce',
      (payload) => {
        // ゲームの開始
        switch (payload.type) {
          case 'gameStart':
            const isDraw = user.id === payload.drawUserId
            updateState(isDraw ? 'draw' : 'answer') // ユーザーのステータスを更新
            setMessages((prev) => [
              ...prev,
              { name: 'announce', text: 'ゲームを開始します｡' },
              {
                name: 'announce',
                text: isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡' // TODO: なんかもうちょいいい言い方
              }
            ])
            break
          case 'gameEnter': // ゲーム中に人が入ってきた
            setMessages((prev) => [
              ...prev,
              {
                name: 'announce',
                text: `${payload.userName}さんが入室しました｡`
              }
            ])
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
