const http = require('http');
const cors = require('cors');
const path = require('path');

const express = require('express');
const {Server} = require('socket.io');


require('dotenv')
    .config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(process.env.MODE_ENV === "production"){
    app.use( express.static( path.resolve(__dirname , "build")) );
    app.get( '*' , (req , res) => {
        res.sendFile( paht.join(__dirname , "build/index.html"));
    });
}


const server = http.createServer(app);

const io = new Server(server , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

const GAMEROOM = "GAMEROOM";
const MAXPLAYERS = 3;

let boxes = [
    [0, 1, 3, 6],
    [2 ,3 ,5, 8],
    [4, 5 ,10 ,18],
    [6 ,7 , 9 , 12],
    [8 ,9 ,11 , 14],
    [10 , 11 ,16 , 19],
    [12 , 13 ,15 , 21],
    [14 , 15 , 17 , 22],
    [16, 17, 20 , 23]

]
let isSelectedBox = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
let isSelectedLine = [];
for(let i =0; i<24; i++){
    isSelectedLine.push(0);
}

let players = [];
// socketID , score , turn , ready
/* ----------------------------------------- */

io.on("connection" , socket => {
    console.log(`socket connected via ${socket.id}`);

    socket.on('join_room' , ({socketID}) => {

        console.log('join_room ----->' , players);

        if(socketID == ""){
            if(players.length >= MAXPLAYERS){
                socket.emit('join_room' , {available: false , message: 'Sorry, Game Room is full'});
            }
            else{
                socket.join(GAMEROOM);
                players.push( {
                    socketID: socket.id,
                    score: 0,
                    turn: false,
                    ready: false
                } );
                console.log('successfully pushed');
                socket.emit('join_room' ,{available: true , message:'Success , You join to Game Room' , socketID: socket.id} );
                io.to(GAMEROOM).emit('get_players' , {players});
            }
        }
        else{
            const player = players.filter( item => item.socketID == socketID);
            if(player.length > 0 || players.length < MAXPLAYERS){
                if(players.length < MAXPLAYERS && player.length == 0){
                    players.push( {
                        socketID: socket.id,
                        score: 0,
                        turn: false,
                        ready: false
                    } );
                }
                players = players.map( item => item.socketID == socketID? {...item , socketID: socket.id} : item);
                socket.join(GAMEROOM);
                socket.emit('join_room',{available: true, message:'Successfully joined again' , socketID: socket.id});
                io.to(GAMEROOM).emit('get_players' , {players});
            }
            else{
                socket.emit('join_room', {available: false, message: 'Sorry, You can not join'} );
            }
        }
    });

    socket.on('get_players' , () => {
        socket.emit('get_players' , {players});
    });
    socket.on('change_players' , ({newPlayers}) => {
        players = [...newPlayers];
        io.to(GAMEROOM).emit('change_players' , {players});
    });

    socket.on('start_game' , () => {
        players = players.map((item , index) => index === 0? {...item , turn: true}: item);
    });

    socket.on('get_gameInfo' , () => {
        socket.emit('get_gameInfo' ,{players , isSelectedBox , isSelectedLine});
    });

    socket.on('change_gameInfo' , value => {
        isSelectedLine[value] = 1;
        let n_matched = 0;
        let indexPlayer;
        players.map((__item , __index) => {
            if(__item.socketID == socket.id)
                indexPlayer = __index;
        });
        isSelectedBox.map( (item , index) => {
            if(item == -1){
                if(boxes[index].indexOf(value) > -1){
                    let _count = 0
                    boxes[index].map( (_item , _index) => {
                        if(isSelectedLine[_item] == 1)
                            _count++;
                    });
                    if(_count == 4){
                        n_matched++;
                        isSelectedBox[index] = indexPlayer;
                    }
                }
            }
        });
        console.log(indexPlayer);
        if(n_matched == 0){
            players[indexPlayer].turn = false;
            players[(indexPlayer + 1) % 3].turn = true;
        }
        else{
            players[indexPlayer].score += n_matched;
        }
        console.log('change_gameInfo -------->' , players , isSelectedBox , isSelectedLine);
        io.to(GAMEROOM).emit('change_gameInfo' , {players , isSelectedBox , isSelectedLine});
    });

    // sc

});



/* ----------------------------------------- */

server.listen(process.env.PORT , () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});
