import React, {
  Dispatch,
  VFC,
  FormEvent,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'
import { SocketContext, UserContext } from './../../App'
import { MessageType } from '../../types'
import { socketEmit } from '../../utils/socket'
import styled from 'styled-components'
type PropsType = {
  setMessages: Dispatch<SetStateAction<MessageType[]>>
}

const ChatForm: VFC<PropsType> = ({ setMessages }) => {
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
    <StyledChatForm
      onSubmit={(e) => {
        hundleSubmit(e)
      }}
    >
      <input
        type="text"
        value={text}
        className="chat-form__input"
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
    </StyledChatForm>
  )
}

const StyledChatForm = styled.form`
  width: 100%;
  background-color: #000000;
  padding: 0.25rem;
  margin-top: 0.25rem;
  .chat-form__input {
    background-color: #ffffff;
    border: 1px solid #333333;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    outline: 0px;
  }
`

export default ChatForm
