import { createContext, useState, VFC } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import { UserType } from './types'
export const ENDPOINT = 'http://127.0.0.1:5000'

const userInitialState = {
  name: '',
  id: ''
}

export const SocketContext = createContext<Socket>({} as Socket) // TODO: 型をいい感じにする
export const UserContext = createContext<UserType>(userInitialState)

const App: VFC = () => {
  const [user, setUser] = useState<UserType>(userInitialState)
  const socket = socketIOClient(ENDPOINT)
  return user.name === '' || user.id === '' ? (
    <SignIn setUser={setUser} />
  ) : (
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={user}>
        <Home user={user} />
      </UserContext.Provider>
    </SocketContext.Provider>
  )
}

export default App
