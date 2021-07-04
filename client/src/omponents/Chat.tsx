import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useContext,
  useEffect
} from 'react'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import { MessageType } from '../types'
import { socketOn } from '../utils/socket'
import { SocketContext } from '../App'

type PropsType = {
  setMessages: Dispatch<SetStateAction<MessageType[]>>
  messages: MessageType[]
}

// 親の更新でレンダリングされたくないのでメモ化
const Chat: FC<PropsType> = memo(({ setMessages, messages }) => {
  const socket = useContext(SocketContext)

  // チャットの受診
  useEffect(() => {
    socketOn<MessageType>(socket, 'chat', (payload) => {
      setMessages((prev) => [
        ...prev,
        { name: payload.name, text: payload.text }
      ])
    })
  }, [socket, setMessages])

  return (
    <>
      <MessageList messages={messages} />
      <ChatForm setMessages={setMessages} />
    </>
  )
})

export default Chat
