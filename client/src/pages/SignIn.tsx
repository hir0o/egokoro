import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import { ENDPOINT } from '../App'
import axios from 'axios'
import { UserType } from '../types'

type PropsType = {
  setUser: Dispatch<SetStateAction<UserType>>
}

const SignIn: FC<PropsType> = ({ setUser }) => {
  const [inputName, setInputName] = useState('')
  const [isEnter, setIsEnter] = useState(true)

  const hundleSubmit = (e: FormEvent) => {
    e.preventDefault()
    axios.post(`${ENDPOINT}/login`, { name: inputName }).then((res) => {
      const { data } = res
      if (data.isEnter) {
        setUser({
          name: inputName,
          id: data.id
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
