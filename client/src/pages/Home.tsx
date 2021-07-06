import { VFC, memo, useContext, useState } from 'react'
import { UserContext } from '../App'
import Game from '../omponents/Game'

const Home: VFC = memo(() => {
  const [theme, setTheme] = useState('')
  const { user } = useContext(UserContext)

  return (
    <div>
      <header className="bg-white border-b	">
        <div className="container mx-auto flex justify-between">
          <div>
            <p>{user.name}さん</p>
            <p>あなたは{user.state === 'draw' ? '描き手' : '回答者'}です。</p>
            {user.state === 'draw' && <p>お題は『{theme}』です。</p>}
          </div>
        </div>
      </header>
      <main className="container pt-4 mx-auto">
        <Game theme={theme} setTheme={setTheme} />
      </main>
    </div>
  )
})

export default Home
