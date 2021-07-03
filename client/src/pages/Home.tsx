import { FC } from 'react'
import Chat from '../omponents/Chat'

type PropsType = {
  name: string
}

const Home: FC<PropsType> = ({ name }) => {
  return (
    <div>
      <h1>Hello{name}</h1>
      <Chat />
    </div>
  )
}

export default Home
