const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http')
const server = http.createServer(app)
const themes = require('./themes.json')
const Canvas = require('canvas') // node-canvasの読み込み

// canvas関連
const canvas = Canvas.createCanvas(800, 600)
const context = canvas.getContext('2d')
context.fillStyle = '#ffffff'
const lastPosition = { x: null, y: null }
let isDrag = false
context.lineCap = 'round'
context.lineJoin = 'round'

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE']
  }
})
const PORT = 5000

app.use(express.static(__dirname))

// CORSを許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )
  next()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json(data)
})

const GAME_MEMBER_MAX = 5
const GAME_MEMBER_MIN = 2
const users = []
let isStart = false
let currentTheme
let count = 0

// 絵を描くひとを順番に返す
const getDrawUser = (() => {
  let currentDrawUser
  return () => {
    if (
      currentDrawUser &&
      users.some((user) => user.id === currentDrawUser.id)
    ) {
      let userIndex = users.findIndex((user) => user.id === currentDrawUser.id)
      if (userIndex >= users.length - 1) {
        currentDrawUser = users[0]
      } else {
        currentDrawUser =
          users[users.findIndex((user) => user.id === currentDrawUser.id) + 1]
      }
    } else {
      currentDrawUser = users[0]
    }
    return currentDrawUser
  }
})()

// お題をランダムに返す
const getTheme = ((themes) => {
  return () => {
    return themes[Math.floor(Math.random() * themes.length)]
  }
})(themes)

app.get('/', (req, res) => {
  res.json({ health: 'ok' })
})

io.on('connection', (socket) => {
  console.log('connect: ', socket.id)
  // 自分以外に送信する関数
  const broadCast = (eventName, payload) =>
    socket.broadcast.emit(eventName, payload)

  // 描画の開始
  socket.on('start', (payload) => {
    console.log('start: ', payload)
    const { tool, color, size } = payload
    context.beginPath()
    isDrag = true
    context.lineWidth = size
    context.strokeStyle = tool === 'pen' ? color : '#FFFFFF'
    broadCast('start', { data: canvas.toDataURL() })
  })

  // マウスが動いているイベント
  socket.on('move', (payload) => {
    console.log('move: ', payload)
    const { x, y } = payload
    console.log(x, y)
    if (!isDrag) {
      return
    }
    if (lastPosition.x === null || lastPosition.y === null) {
      context.moveTo(x, y)
    } else {
      context.moveTo(lastPosition.x, lastPosition.y)
    }
    context.lineTo(x, y)
    context.stroke()

    lastPosition.x = x
    lastPosition.y = y
    broadCast('move', { data: canvas.toDataURL() })
  })

  // マウスが離れたイベント
  socket.on('end', () => {
    context.closePath()
    isDrag = false
    lastPosition.x = null
    lastPosition.y = null
    console.log('end_data: ', canvas.toDataURL())
    broadCast('end', { data: canvas.toDataURL() })
  })

  // チャット送信のイベント
  socket.on('chat', (payload) => {
    const { name, id, text } = payload
    broadCast('chat', payload)
    if (text === currentTheme) {
      io.emit('announce', {
        type: 'correct',
        userName: name
      })

      // お題を更新
      currentTheme = getTheme()
      io.emit('announce', {
        type: 'nextTheme',
        theme: currentTheme,
        drawUserId: getDrawUser().id
      })
    }
  })

  // チャット送信のイベント
  socket.on('next', (payload) => {
    broadCast('next', payload)
  })

  // 入室時のイベント
  socket.on('enter', (payload) => {
    const { name } = payload
    const { id } = socket

    // 入室できるかどうか
    if (users.length > GAME_MEMBER_MAX) {
      io.to(socket.id).emit('enter', { isEnter: false })
    } else {
      // 入室ok
      users.push({ name, id })

      console.log('enter: ', users)

      // 結果を送信
      io.to(socket.id).emit('enter', { isEnter: true, id })

      if (users.length >= GAME_MEMBER_MIN && !isStart) {
        isStart = true
        count = 0
        currentTheme = getTheme()
        // ? 入室を待つため，100msおく
        // ? すぐに送信するとHomeコンポーネントが呼ばれる前に送信しちゃう
        // TODO: そもそもSignInコンポーネントからenterしなちゃいいのでは？
        setTimeout(() => {
          io.emit('announce', {
            type: 'gameStart',
            theme: currentTheme,
            drawUserId: getDrawUser().id
          })
        }, 100)
      } else if (isStart) {
        setTimeout(() => {
          io.emit('announce', {
            type: 'gameEnter',
            theme: currentTheme,
            user: users.find((user) => user.id === socket.id)
          })
        })
      }
    }
  })

  socket.on('disconnect', () => {
    // 不明なdisconnectを回避
    if (!users.some((user) => user.id === socket.id)) return
    // 離脱したユーザーを削除
    users.splice(
      users.findIndex((user) => user.id === socket.id),
      1
    )
    console.log('disconnect: ', users)
    console.log('user length', users.length)
    // 1人になったらゲーム終了
    if (users.length <= 1) {
      isStart = false
      io.emit('announce', {
        type: 'gameEnd'
      })
    }
  })
})

server.listen(PORT, () => {})
