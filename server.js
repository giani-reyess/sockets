const { Server } = require('net')

const host = "0.0.0.0"
const END = 'END' 


const connections = new Map()

// THIS FUNCTION TRIGGER ERRORS IF THERE ARE 
const error = (message) => {
    console.error(message)
    process.exit(1)
}

// THIS FUNCTION ECHO ANY MESSAGE TO EVERY USER (except the origin user)
const sendMessage = (message, origin) => {
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message)
        }
    }
}

// THIS FUNCTION SERVE ALL THE REQUEST FROM THE CLIENT, 
// IS THE SERVER ITSELF 
const listenClient = (port) => {
    const server = new Server()

    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`
        console.log(`New connection from ${remoteSocket}`)
        
        socket.setEncoding('utf-8')
        socket.on("data", (message) => {
            // connections.values()
            // If "connections" function doesn't have the incomming socket,
            if(!connections.has(socket)){
                console.log(`Username ${message} set for connection ${remoteSocket}`)
                // then it will be storaged.
                connections.set(socket, message)
            }
            // If "END" is typed in the client command line the connection will end
            else if (message === END) {
                connections.delete(socket)
                socket.end()
            } // Else the server still be showing the socket -> message
            else {
                const fullMessage = `[${connections.get(socket)}:${message}]`
                console.log(`${remoteSocket} -> ${fullMessage}`)
                sendMessage(fullMessage, socket)
            }
        })
        server.on('error', (err) => error(err.message))    
        socket.on("close", () => {
            console.log(`Connection with ${remoteSocket} closed`)
    })
     
    })
    server.listen({port, host}, () => {
        console.log(`Listening on port ${port}`)
    })
    
    server.on('error', (err) => error(err.message))  
} 


const main = () => {   
     if (process.argv.length !== 3) {
         error(`Usage: node ${__filename} port`)
     }
     let port = process.argv[2]
      
     if (isNaN(port)) {
         error(`invalid port ${port}`)
     }
     port = Number(port)
     listenClient(port)
}
 
if (require.main === module) {
    main()
}


