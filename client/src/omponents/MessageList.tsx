import { FC } from 'react'
import MessageItem from './MessageItem'

const messages = [
  {
    name: 'ユーザー1',
    text: 'わああ'
  },
  {
    name: 'ユーザー2',
    text: 'やああ'
  },
  {
    name: 'announce',
    text: 'ゲームを開始します．'
  },
  {
    name: 'ユーザー3',
    text: 'ぐああ'
  },
  {
    name: 'announce',
    text: '正解です！'
  }
]

const MessageList: FC = () => {
  return (
    <ul className="border border-gray-400">
      {messages.map(({ name, text }) => (
        <MessageItem name={name} text={text} />
      ))}
    </ul>
  )
}

export default MessageList
