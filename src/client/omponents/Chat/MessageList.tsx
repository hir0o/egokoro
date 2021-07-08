import React, { VFC, useEffect } from 'react'
import MessageItem from './MessageItem'
import { MessageType } from '../../types'
import styled from 'styled-components'

type PropsType = {
  messages: MessageType[]
}

const MessageList: VFC<PropsType> = ({ messages }) => {
  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <StyledMessageList id="scroll-area">
      {messages.map(({ name, text }, index) => (
        <MessageItem name={name} text={text} key={index} />
      ))}
    </StyledMessageList>
  )
}

// border sm:max-w-xl sm:mx-auto overflow-scroll
const StyledMessageList = styled.ul`
  max-height: calc(400px - 41px);
  min-height: calc(400px - 41px);
  border: 1px solid #333333;
  overflow: scroll;
  @media (max-width: 1120px) {
    margin-left: auto;
    margin-right: auto;
  }
`

export default MessageList
