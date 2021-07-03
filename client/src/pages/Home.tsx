import { FC } from 'react'
import { Socket } from 'socket.io-client'
import MessageList from '../omponents/MessageList'

type PropsType = {
  name: string
  socket: Socket
}

const Home: FC<PropsType> = ({ name }) => {
  return (
    <div>
      <h1>Hello{name}</h1>
      <MessageList />
    </div>
  )
}

export default Home
