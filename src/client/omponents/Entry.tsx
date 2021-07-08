import React, {
  Dispatch,
  VFC,
  FormEvent,
  SetStateAction,
  useContext,
  useState
} from 'react'
import styled from 'styled-components'
import { SocketContext } from '../App'
import { UserType } from '../types'
import { socketEmit, socketOn } from '../utils/socket'

type PropsType = {
  setUser: Dispatch<SetStateAction<UserType>>
}

const SignIn: VFC<PropsType> = ({ setUser }) => {
  const [inputName, setInputName] = useState('')
  const [isEnter, setIsEnter] = useState(true)

  const socket = useContext(SocketContext)

  const hundleSubmit = (e: FormEvent) => {
    e.preventDefault()

    socketEmit(socket, 'enter', { name: inputName })
    socketOn(socket, 'enter', (payload) => {
      if (payload.isEnter) {
        setUser((prev) => {
          return { ...prev, name: inputName, id: payload.id as string }
        })
      } else {
        setIsEnter(false)
      }
    })
  }

  return (
    <StyledEnter onSubmit={(e) => hundleSubmit(e)}>
      <h1 className="enter__title">ニックネームを入力してください．</h1>
      <input
        type="text"
        name="name"
        className="enter__input"
        onChange={(e) => {
          setInputName(e.target.value)
        }}
      />
      {!isEnter && (
        <p className="enter__info">満員です．しばらくお待ちください．</p>
      )}
    </StyledEnter>
  )
}
const StyledEnter = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  .enter__title {
    font-size: 2rem;
  }
  .enter__input {
    border-bottom: 1px solid #e5e5e5;
    font-size: 2rem;
    padding: 1rem;
    text-align: center;
    margin-top: 3rem;
    outline: none;
  }
  .enter__info {
    margin-top: 1rem;
  }
`

export default SignIn
