import { useState, VFC } from 'react'
import socketIOClient from 'socket.io-client'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
export const ENDPOINT = 'http://127.0.0.1:5000'

const App: VFC = () => {
  const [name, setName] = useState('aa')
  const socket = socketIOClient(ENDPOINT)
  return name === '' ? (
    <SignIn setName={setName} />
  ) : (
    <Home name={name} socket={socket} />
  )
}

export default App
