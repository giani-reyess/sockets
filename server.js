const { Socket } = require('dgram')
const { Server } = require('net')

const server = new Server()

server.on("connection", (socket) => {
    console.log('New connection from', socket.remoteAddress)
})

server.listen({port: 8000, host: '0.0.0.0'}, () => {
    console.log('Lsitening on port 8000')
})

