import { useEffect, VFC } from 'react'
import logo from './logo.svg'
import './App.css'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://127.0.0.1:5000'

const App: VFC = () => {
  const socket = socketIOClient(ENDPOINT)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          onClick={() => {
            socket.emit('test', 'test')
          }}
        >
          お試し
        </button>
      </header>
    </div>
  )
}

export default App
