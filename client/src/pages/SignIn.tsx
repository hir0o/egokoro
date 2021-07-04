import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { ENDPOINT, SocketContext } from '../App'
import axios from 'axios'
import { UserType } from '../types'
import { socketEmit } from '../utils/socket'

type PropsType = {
  setUser: Dispatch<SetStateAction<UserType>>
}

const SignIn: FC<PropsType> = ({ setUser }) => {
  const [inputName, setInputName] = useState('')
  const [isEnter, setIsEnter] = useState(true)

  const socket = useContext(SocketContext)

  const hundleSubmit = (e: FormEvent) => {
    e.preventDefault()
    axios.post(`${ENDPOINT}/login`, { name: inputName }).then((res) => {
      const { data } = res
      if (data.isEnter) {
        socketEmit(socket, 'enter', '')
        setUser((prev) => {
          return { ...prev, name: inputName, id: data.id }
        })
      } else {
        setIsEnter(false)
      }
    })
  }

  return (
    <>
      <form onSubmit={(e) => hundleSubmit(e)}>
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
