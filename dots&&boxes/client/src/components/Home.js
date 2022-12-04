import * as React from 'react';
import Logo from '../assets/img/logo.png';
import {Link , useNavigate} from 'react-router-dom';
import {socket} from '../socketAPI';
import { MAXN } from '../App';

const Home = () => {

    const [players , setPlayers] = React.useState([]);
    const [message , setMessage] = React.useState("");

    const navigate = useNavigate();


    React.useEffect( () => {
        const socketID = window.localStorage.getItem('socketID')? window.localStorage.getItem('socketID'): "";
        console.log('I am useEffect');
        socket.emit('join_room' , {socketID});

    } , []);

    React.useEffect(() => {
        console.log(players);
        const playerN = players.filter(item => item.ready == true);
        if(playerN.length === MAXN){
            socket.emit('start_game');
            navigate('/board');
        }
    } , [players]);

    socket.on('get_players' , ({players}) => {
        setPlayers(players);
    });
    socket.on('change_players' , ({players}) => {
        setPlayers(players);
    });


    socket.on('join_room' , (data) => {
        setMessage(data.message);
        if(data.available){
            window.localStorage.setItem('socketID' , data.socketID);
            socket.emit('get_players');
        }
    });

    const handleReady = () => {
        socket.emit('change_players' , {newPlayers: players.map( (item , index) => {
            if(item.socketID == window.localStorage.getItem('socketID'))
                return {...item , ready: true};
            return item;
        })});
    }

    return (
        <div>
            <h1
                style = {{ fontSize: '100px' }}
            >
                Dots And Boxes
            </h1>
            <div className = "board">
            <div className = "image">
                <img
                    style = {{ height: '50%' , width: '50%' , alignItems: 'center' }}
                    src={Logo}
                    alt=""
                />
                <h1
                    style = {{ paddingTop: '0' , paddingBottom: '5%' }}
                >
                    <a href="https://en.wikipedia.org/wiki/Dots_and_Boxes">
                        Rules
                    </a>
                </h1>
            </div>
            <div className = "connection">
                <Link to = "#" className = "start" id="start-btn" onClick={handleReady}> Start Game </Link>
            </div>
                <div style = {{ color: 'white' , marginTop: '20px' , textAlign: 'center'  }}>
                    <h3>{message}</h3>
                    {players.map(item => <div key={item.socketID}>
                        -{item.socketID}
                        {item.ready ? <span style = {{color: 'orange',  marginLeft: '15px' }}>ready</span>:<span></span>}
                        </div>)}
                </div>
            </div>
        </div>
    );
};


export {Home};
