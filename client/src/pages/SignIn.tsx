import { FC, FormEvent, useState } from 'react'
import { Socket } from 'socket.io-client'
import { ENDPOINT } from '../App'
import axios from 'axios'

type PropsType = {
  setName: React.Dispatch<React.SetStateAction<string>>
  socket: Socket
}

const SignIn: FC<PropsType> = ({ setName, socket }) => {
  const [inputName, setInputName] = useState('')
  const [isEnter, setIsEnter] = useState(true)

  const hundleSubmit = (e: FormEvent) => {
    e.preventDefault()
    axios.post(`${ENDPOINT}/login`, { name: inputName }).then((res) => {
      const { data } = res
      if (data.isEnter) {
        setName(inputName)
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
