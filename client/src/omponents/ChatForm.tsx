import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { SocketContext, NameContext } from '../App'
import { MessageType } from '../types'
import { socketEmit } from '../utils/socket'
type PropsType = {
  setMessages: Dispatch<SetStateAction<MessageType[]>>
}

const ChatForm: FC<PropsType> = ({ setMessages }) => {
  const [text, setText] = useState('')
  const socket = useContext(SocketContext)
  const name = useContext(NameContext)

  const hundleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text === '') {
      alert('テキストを入力してください．')
      return
    }
    setMessages((prev) => [...prev, { name, text }])
    socketEmit(socket, 'chat', { name, text })
    setText('')
  }

  return (
    <form
      onSubmit={(e) => {
        hundleSubmit(e)
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
    </form>
  )
}

export default ChatForm
