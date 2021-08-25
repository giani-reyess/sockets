const {Socket} = require('net')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout   
})

const END = 'END'

const error = (message) => {
    console.error(message)
    process.exit(1)
}


const connectToServer = (host,port) => {
    console.log(`Connecting to ${host}:${port}`)
    
    // Connecting to the server
    const socket = new Socket()
    socket.connect({host, port})
    socket.setEncoding('utf-8') 

    socket.on('connect', () => {
        console.log('Connected')

        readline.question("Choose your username: ", (username) => {
            socket.write(username)
        })

        // Listening any input from the command line and returning through same via   
        readline.on("line", (message) => {
            socket.write(message)
            // If "END" is typed in client (command line) the connection will end
            if (message === END) {
                socket.end()
                console.log('Disconnected')
                process.exit(0)
            }
        })
        
        socket.on("data", (data) => {
            console.log(data)
        })
    })  
    
    socket.on("error", (err) => error(err.message))
    // socket.on("close", () => {
    //     console.log('Disconnected')
    //     process.exit(0)
    // })
}    

// THROUGH "main" FUNCTION WE PROVIDE HOSTNAME AND PORT TO "connectToServer" 
// WICH IN TURN SEND IT TO SERVER  
const main = () => {
    if (process.argv.length !== 4) {
        error(`Usage:node ${__filename} host port`)
    }
    let [, , host, port] = process.argv

    if (isNaN(port)) {
        error(`invalid port ${port}`)
    }
    port = Number(port)  
    console.log(`${host}:${port}`)
    connectToServer(host, port)
}

if (module === require.main){
    main()
}