import React, { VFC } from 'react'
import styled from 'styled-components'

type PropsType = {
  name: string
  text: string
}

const MessageItem: VFC<PropsType> = ({ name, text }) => {
  return (
    <StyledMessageList isInfo={name === 'announce'}>
      {name}: {text}
    </StyledMessageList>
  )
}

const StyledMessageList = styled.li<{ isInfo: boolean }>`
  border-bottom: 1px solid #333333;
  padding: 0.5rem;
  ${({ isInfo }) =>
    isInfo &&
    `
    background: #CDE6EE;
  `}
`

export default MessageItem
