const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http')
const server = http.createServer(app)
const themes = require('./themes.json')

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

const users = []
let globalSocket
const MAX_NUMBER_OF_PEOPLE = 5
let isStart = false
let currentThemes = themes[Math.floor(Math.random() * themes.length)]
let count = 0

// 絵を描くひとを順番に返す
const getCurrentDrawUser = (() => {
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

app.get('/', (req, res) => {
  res.json({ health: 'ok' })
})

io.on('connection', (socket) => {
  globalSocket = socket
  // 自分以外に送信する関数
  const broadCast = (eventName, payload) =>
    socket.broadcast.emit(eventName, payload)

  // 描画の開始
  socket.on('start', (payload) => {
    broadCast('start', payload)
  })

  // マウスが動いているイベント
  socket.on('move', (payload) => {
    broadCast('move', payload)
  })

  // マウスが離れたイベント
  socket.on('end', (payload) => {
    broadCast('end', payload)
  })

  // チャット送信のイベント
  socket.on('chat', (payload) => {
    console.log(getCurrentDrawUser())
    broadCast('chat', payload)
  })

  // チャット送信のイベント
  socket.on('next', (payload) => {
    broadCast('next', payload)
  })

  // 入室時のイベント
  socket.on('enter', (payload) => {
    // ゲーム開始する処理
    if (users.length >= 2 && !isStart) {
      isStart = true
      count = 0
      io.emit('announce', {
        type: 'gameStart',
        theme: currentThemes,
        drawUserId: getCurrentDrawUser().id
      })
    }
  })

  socket.on('disconnect', () => {
    // 離脱したユーザーを削除
    users.splice(
      users.findIndex((user) => user.id === socket.id),
      1
    )
    // 1人になったらゲーム終了
    if (users.length <= 1) {
      globalSocket.on('gameEnd', () => {
        io.emit('announce', {
          type: 'gameEnd'
        })
      })
    }
  })
})

app.post('/login', (req, res) => {
  const { name } = req.body
  const { id } = globalSocket
  users.push({ name, id })

  // 最大人数以上は入らない
  if (users.length <= MAX_NUMBER_OF_PEOPLE) {
    res.json({ isEnter: true, id })
  } else {
    res.json({ isEnter: false })
  }
})

server.listen(PORT, () => {
  console.log(`istening on *:${PORT}`)
})
