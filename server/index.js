const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http')
const server = http.createServer(app)

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

app.use(bodyParser.json())

const users = {}
let socketId
const MAX_NUMBER_OF_PEOPLE = 5

app.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

io.on('connection', (socket) => {
  socketId = socket.id
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

  // test
  socket.on('test', (payload) => {
    console.log(payload)
  })

  socket.on('disconnect', () => {
    console.log(socket.id)
    delete users[socket.id]
  })
})

app.post('/login', (req, res) => {
  const { name } = req.body
  users[socketId] = name
  console.log({ users })
  // 最大人数以上は入らない
  if (Object.keys(users).length <= MAX_NUMBER_OF_PEOPLE) {
    res.json({ isEnter: true })
  } else {
    res.json({ isEnter: false })
  }
})

server.listen(PORT, () => {
  console.log(`istening on *:${PORT}`)
})
