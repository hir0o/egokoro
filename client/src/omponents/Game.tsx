import { FC, memo, useContext, useEffect, useState } from 'react'
import { SocketContext, UserContext } from '../App'
import { MessageType, UserType } from '../types'
import { socketOn } from '../utils/socket'
import Chat from './Chat'

// ゲームの進行をつかさどるつもりコンポーネント

const Game: FC = memo(() => {
  const { user, updateState } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [messages, setMessages] = useState<MessageType[]>([])

  const [theme, setTheme] = useState('')

  // TODO: 長いからどっか移す
  useEffect(() => {
    socketOn<{
      [key: string]: string | number | { [key: string]: string | number }
    }>(socket, 'announce', (payload) => {
      // ゲームの開始
      switch (payload.type) {
        case 'gameStart':
          {
            const isDraw = user.id === payload.drawUserId
            updateState(isDraw ? 'draw' : 'answer') // ユーザーのステータスを更新
            setTheme(isDraw ? (payload.theme as string) : '') // お題を更新
            setMessages((prev) => [
              ...prev,
              { name: 'announce', text: 'ゲームを開始します｡' },
              {
                name: 'announce',
                text: isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡' // TODO: なんかもうちょいいい言い方
              }
            ])
            if (isDraw) {
              setMessages((prev) => [
                ...prev,
                {
                  name: 'announce',
                  text: `お題は${payload.theme}です．`
                }
              ])
            }
          }
          break
        case 'gameEnter': // ゲーム中に人が入ってきた
          setTheme(payload.theme as string) // お題を更新
          // 受信が入室した人だったら，役割をお知らせ
          if ((payload.user as UserType)?.id === user.id) {
            setMessages((prev) => [
              ...prev,
              {
                name: 'announce',
                text: 'あなたは回答します｡'
              }
            ])
          } else {
            // 他の人に入室をお知らせ
            setMessages((prev) => [
              ...prev,
              {
                name: 'announce',
                text: `${(payload.user as UserType)?.name}さんが入室しました｡`
              }
            ])
          }
          break
        case 'correct':
          setMessages((prev) => [
            ...prev,
            {
              name: 'announce',
              text: `${payload.userName}さん正解！`
            }
          ])
          break
        case 'nextTheme': // 次のお題
          {
            const isDraw = user.id === payload.drawUserId
            updateState(isDraw ? 'draw' : 'answer') // ユーザーのステータスを更新
            setTheme(isDraw ? (payload.theme as string) : '') // お題を更新
            setMessages((prev) => [
              ...prev,
              {
                name: 'announce',
                text: isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡'
              }
            ])
            if (isDraw) {
              setMessages((prev) => [
                ...prev,
                {
                  name: 'announce',
                  text: `お題は${payload.theme}です．`
                }
              ])
            }
          }
          break
        case 'gameEnd':
          setMessages((prev) => [
            ...prev,
            {
              name: 'announce',
              text: 'ゲームを中断します．'
            }
          ])
          break
        default:
          break
      }
    })
    // TODO: react-hooks/exhaustive-depsだけ無効にする
    /* eslint-disable */
  }, [])
  /* eslint-able */
  return (
    <div>
      <h1>name: {user.name}</h1>
      <h1>id: {user.id}</h1>
      <h1>state: {user.state}</h1>
      {user.state === 'draw' && <h1>theme: {theme}</h1>}
      <canvas></canvas>
      <Chat messages={messages} setMessages={setMessages} />
    </div>
  )
})

export default Game
