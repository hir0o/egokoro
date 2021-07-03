import { FC } from 'react'
import { Socket } from 'socket.io-client'

type PropsType = {
  name: string
  socket: Socket
}

const Home: FC<PropsType> = ({ name }) => {
  return <h1>Hello{name}</h1>
}

export default Home
