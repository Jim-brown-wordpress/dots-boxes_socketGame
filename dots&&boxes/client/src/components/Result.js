import * as React from 'react';
import {socket} from '../socketAPI';

const Result = () => {

    const [players , setPlayers] = React.useState([]);
    const [isSelectedBox , setIsSelectedBox] = React.useState([]);
    const [isSelectedLine , setIsSelectedLine] = React.useState([]);

    React.useEffect(() => {
        socket.emit('get_gameInfo');
    } , []);

    socket.on('get_gameInfo' , ({players , isSelectedBox , isSelectedLine}) => {
        setPlayers(players);
        setIsSelectedBox(isSelectedBox);
        setIsSelectedLine(isSelectedLine);

        console.log(players);
    });

    const handleClick = e => {
        e.preventDefault();
    }

    return (
        <div class="board">
            <h1 id="message">
                <span id="message">
                    <h2 style={{marginBottom: '20px' , color: 'deeppink'}}>Result</h2>
                    <h4>Me{'  '}
                        <span id = "p1Score" className = "p1">{players.length > 0 ?players.filter(item => item.socketID == window.localStorage.getItem('socketID'))[0].score:0}</span>
                    </h4>
                    <h4>Player A
                        <span id="p2Score" className="p2" style={{ marginLeft: '20px' }}>{players.length > 0 ? players.filter(item => item.socketID != window.localStorage.getItem('socketID'))[0].score : 0}</span>
                    </h4>
                    <h4>Player B
                        <span id="p3Score" className="p3"  style={{ marginLeft: '20px' }}>{players.length > 0 ?players.filter(item => item.socketID != window.localStorage.getItem('socketID'))[1].score : 0}</span>
                    </h4>
                </span>
                <button style={{backgroundColor: 'orange' , color: 'white' , border: 'none' , padding: '15px' , cursor:'pointer' , marginTop: '50px'}} onClick = {handleClick}>First Page</button>
            </h1>
        </div>
    );
};


export {Result};
