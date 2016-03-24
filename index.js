const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Spider = require('./dist/Spider')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(bodyParser())
app.use(express.static('./client'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html')
})

io.on('connection', socket => {
  socket.on('fetch start', data => {
    Spider(data.url, socket)
  })
})

server.listen(3001)

app.listen(8080)
