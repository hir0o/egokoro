import React, { FC, useEffect } from 'react'
import MessageItem from './MessageItem'
import { MessageType } from '../types'

type PropsType = {
  messages: MessageType[]
}

const MessageList: FC<PropsType> = ({ messages }) => {
  const style = {
    maxHeight: '400px',
    minHeight: '400px',
    width: '600px'
  }

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <ul
      className="border sm:max-w-xl sm:mx-auto overflow-scroll"
      style={style}
      id={'scroll-area'}
    >
      {messages.map(({ name, text }, index) => (
        <MessageItem name={name} text={text} key={index} />
      ))}
    </ul>
  )
}

export default MessageList
