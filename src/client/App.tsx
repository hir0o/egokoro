import React, { createContext, useMemo, useState, VFC } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'
import Home from './omponents/Home'
import SignIn from './omponents/Entry'
import { UserType, StateType } from './types'
export const ENDPOINT = 'http://127.0.0.1:5000'

const userInitialState: UserType = {
  name: '',
  id: '',
  state: 'answer'
}

export const SocketContext = createContext<Socket>({} as Socket)
export const UserContext = createContext<{
  user: UserType
  updateState: (newState: StateType) => void
}>({ user: userInitialState, updateState: () => {} })

const App: VFC = () => {
  const [user, setUser] = useState<UserType>(userInitialState)
  const socket = useMemo(() => socketIOClient(ENDPOINT), [])

  const updateState = (newState: StateType) => {
    setUser((prev) => {
      return { ...prev, state: newState }
    })
  }

  return user.name === '' || user.id === '' ? (
    <SocketContext.Provider value={socket}>
      <SignIn setUser={setUser} />
    </SocketContext.Provider>
  ) : (
    // TODO: Context用のコンポーネントを作成
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={{ user, updateState }}>
        <Home />
      </UserContext.Provider>
    </SocketContext.Provider>
  )
}

export default App
