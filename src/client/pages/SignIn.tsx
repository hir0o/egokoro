import React, {
  Dispatch,
  VFC,
  FormEvent,
  SetStateAction,
  useContext,
  useState
} from 'react'
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
    <>
      <form
        onSubmit={(e) => hundleSubmit(e)}
        className="flex justify-center flex-col items-center h-screen w-full"
      >
        <h1 className="text-lg">ニックネームを入力してください．</h1>
        <input
          type="text"
          name="name"
          className="border-b text-3xl p-4 text-center mt-12 outline-none"
          onChange={(e) => {
            setInputName(e.target.value)
          }}
        />
        {!isEnter && <p className="mt-4">満員です．しばらくお待ちください．</p>}
      </form>
    </>
  )
}

export default SignIn
