import React, { VFC, memo, useContext, useState } from 'react'
import styled from 'styled-components'
import { UserContext } from '../App'
import Game from './Game/Game'

const Home: VFC = memo(() => {
  const [theme, setTheme] = useState('')
  const { user } = useContext(UserContext)

  return (
    <StyledHome>
      <header className="header">
        <div className="header__inner">
          <p>{user.name}さん</p>
          <p>
            あなたは{user.state === 'draw' ? '描き手' : '回答者'}です。
            {user.state === 'draw' && `お題は『${theme}』です。`}
          </p>
        </div>
      </header>
      <main className="main">
        <Game theme={theme} setTheme={setTheme} />
      </main>
    </StyledHome>
  )
})

const StyledHome = styled.div`
  .header {
    border-bottom: 1px solid #333333;
  }
  .header__inner {
    padding-right: calc((100vw - 1400px) / 2);
    padding-left: calc((100vw - 1400px) / 2);
    @media (max-width: 1400px) {
      padding-right: calc((100vw - 600px) / 2);
      padding-left: calc((100vw - 600px) / 2);
    }
  }
  .main {
    padding-top: 1rem;
    padding-right: calc((100vw - 1400px) / 2);
    padding-left: calc((100vw - 1400px) / 2);
    @media (max-width: 1400px) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`

const StyledMain = styled.main``

export default Home
