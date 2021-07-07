import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'
import { SocketContext, UserContext } from '../App'
import { MessageType } from '../types'
import { socketEmit } from '../utils/socket'
type PropsType = {
  setMessages: Dispatch<SetStateAction<MessageType[]>>
}

const ChatForm: FC<PropsType> = ({ setMessages }) => {
  const [text, setText] = useState('')
  const socket = useContext(SocketContext)
  const { user } = useContext(UserContext)

  const hundleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (text === '') {
        alert('テキストを入力してください．')
        return
      }
      setMessages((prev) => [...prev, { name: user.name, text }])
      socketEmit(socket, 'chat', { ...user, text })
      setText('')
    },
    [socket, text, setMessages, user]
  )

  return (
    <form
      className="w-full bg-black p-1"
      onSubmit={(e) => {
        hundleSubmit(e)
      }}
    >
      <input
        type="text"
        value={text}
        className="border w-full"
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
    </form>
  )
}

export default ChatForm
