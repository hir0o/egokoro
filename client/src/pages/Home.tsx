import { FC } from 'react'
import Game from '../omponents/Game'
import DrawCanvas from '../omponents/DrawCanvas'

const Home: FC = () => {
  return (
    <div>
      <Game />
      <hr />
      <DrawCanvas />
    </div>
  )
}

export default Home
