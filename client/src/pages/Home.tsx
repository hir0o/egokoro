import { FC } from 'react'
import Chat from '../omponents/Chat'
import { UserType } from '../types'

type PropsType = {
  user: UserType
}

const Home: FC<PropsType> = ({ user }) => {
  return (
    <div>
      <h1>name: {user.name}</h1>
      <h1>id: {user.id}</h1>
      <Chat />
    </div>
  )
}

export default Home
