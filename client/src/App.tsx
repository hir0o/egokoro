import { createContext, useState, VFC } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
export const ENDPOINT = 'http://127.0.0.1:5000'

export const SocketContext = createContext<Socket>({} as Socket) // TODO: 型をいい感じにする
export const NameContext = createContext('')

const App: VFC = () => {
  const [name, setName] = useState('a')
  const socket = socketIOClient(ENDPOINT)
  return name === '' ? (
    <SignIn setName={setName} />
  ) : (
    <SocketContext.Provider value={socket}>
      <NameContext.Provider value={name}>
        <Home name={name} />
      </NameContext.Provider>
    </SocketContext.Provider>
  )
}

export default App
