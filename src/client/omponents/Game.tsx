import {
  Dispatch,
  memo,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  VFC
} from 'react'
import { SocketContext, UserContext } from '../App'
import { LineType, MessageType, UserType } from '../types'
import { socketOn } from '../utils/socket'
import { addArrayState } from '../utils/useState'
import Chat from './Chat'
import DrawCanvas from './DrawCanvas'

type PropType = {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}

const Game: VFC<PropType> = memo(({ theme, setTheme }) => {
  const { user, updateState } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [lines, setLines] = useState<LineType[]>([])
  const [imageData, setImageData] = useState('')

  const setAnnounce = (text: string) =>
    addArrayState<MessageType>({ name: 'announce', text }, setMessages)

  useEffect(() => {
    socketOn<{
      [key: string]: string | number | { [key: string]: string | number }
    }>(socket, 'announce', (payload) => {
      // ゲームの開始
      switch (payload.type) {
        case 'gameStart':
          {
            const isDraw = user.id === payload.drawUserId
            setImageData(payload.data as string)
            updateState(isDraw ? 'draw' : 'answer') // ユーザーのステータスを更新
            setTheme(isDraw ? (payload.theme as string) : '') // お題を更新
            setAnnounce('ゲームを開始します｡')
            setAnnounce(
              isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡' // TODO: なんかもうちょいいい言い方
            )
            // 描く人の場合
            if (isDraw) {
              setAnnounce(`お題は『${payload.theme}』です．`)
              setLines([])
            }
          }
          break
        case 'gameEnter': // ゲーム中に人が入ってきた
          setTheme(payload.theme as string) // お題を更新
          // 受信が入室した人だったら，役割をお知らせ
          if ((payload.user as UserType)?.id === user.id) {
            setImageData(payload.data as string)
            setAnnounce('あなたは回答します｡')
          } else {
            // 他の人に入室をお知らせ
            setAnnounce(
              `${(payload.user as UserType)?.name}さんが入室しました｡`
            )
          }
          break
        case 'correct': // 正解
          setAnnounce(`${payload.userName}さん正解！`)
          break
        case 'nextTheme': // 次のお題
          {
            const isDraw = user.id === payload.drawUserId
            setImageData('') //画像を初期化
            updateState(isDraw ? 'draw' : 'answer') // ユーザーのステータスを更新
            setTheme(isDraw ? (payload.theme as string) : '') // お題を更新
            setAnnounce(
              isDraw ? 'あなたは絵を描きます｡' : 'あなたは回答します｡'
            )
            if (isDraw) {
              setAnnounce(`お題は『${payload.theme}』です．`)
              setLines([])
            }
          }
          break
        case 'gameEnd':
          setAnnounce('ゲームを中断します．')
          setLines([])
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
    <div className="flex flex-wrap">
      <DrawCanvas
        lines={lines}
        setLines={setLines}
        imageData={imageData}
        setImageData={setImageData}
      />
      <Chat messages={messages} setMessages={setMessages} />
    </div>
  )
})

export default Game
