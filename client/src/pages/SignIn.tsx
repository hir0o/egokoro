import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { SocketContext } from '../App'
import { UserType } from '../types'
import { socketEmit, socketOn } from '../utils/socket'

type PropsType = {
  setUser: Dispatch<SetStateAction<UserType>>
}

const SignIn: FC<PropsType> = ({ setUser }) => {
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
    <>
      <form onSubmit={(e) => hundleSubmit(e)}>
        <p>わああ</p>
        <input
          type="text"
          name="name"
          onChange={(e) => {
            setInputName(e.target.value)
          }}
        />
      </form>
      {!isEnter && <p>満員です．しばらくお待ちください．</p>}
    </>
  )
}

export default SignIn
