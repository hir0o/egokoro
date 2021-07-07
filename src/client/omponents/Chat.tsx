import React, {
  Dispatch,
  memo,
  SetStateAction,
  useContext,
  useEffect,
  VFC
} from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketOn } from '../utils/socket'
import { SocketContext, UserContext } from '../App'

type PropsType = {
  setMessages: Dispatch<SetStateAction<MessageType[]>>
  messages: MessageType[]
}

// 親の更新でレンダリングされたくないのでメモ化
const Chat: VFC<PropsType> = memo(({ setMessages, messages }) => {
  const socket = useContext(SocketContext)
  const { user } = useContext(UserContext)

  // チャットの受信
  useEffect(() => {
    socketOn<MessageType>(socket, 'chat', (payload) => {
      setMessages((prev) => [
        ...prev,
        { name: payload.name, text: payload.text }
      ])
    })
  }, [socket, setMessages])

  return (
    <div className="mx-auto">
      <MessageList messages={messages} />
      {user.state === 'answer' && <ChatForm setMessages={setMessages} />}
    </div>
  )
})

export default Chat
