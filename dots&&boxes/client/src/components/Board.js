import * as React from 'react';
import {Link} from 'react-router-dom';
import {socket} from '../socketAPI';
import {useNavigate} from 'react-router-dom';

const colors = ["#66bcf2" , "#f2accd" ,"#42b883" ];

const Board = () => {
    const naviage = useNavigate();
    const [players , setPlayers] = React.useState([]);
    const [isSelectedBox , setIsSelectedBox] = React.useState([]);
    const [isSelectedLine , setIsSelectedLine] = React.useState([]);


    React.useEffect(() => {
        socket.emit('get_gameInfo');
    } , []);

    React.useEffect(() => {
        if(isSelectedLine.length > 0){
            const count0 = isSelectedLine.filter(item => item == 0).length;
            if(count0 == 0){
                naviage('/result');
            }
        }
    } , [isSelectedLine]);

    socket.on('get_gameInfo' , ({players , isSelectedBox , isSelectedLine}) => {
        setPlayers(players);
        setIsSelectedBox(isSelectedBox);
        setIsSelectedLine(isSelectedLine);

        console.log(players);
    });
    socket.on('change_gameInfo' , ({players , isSelectedBox , isSelectedLine}) => {
        setPlayers(players);
        setIsSelectedBox(isSelectedBox);
        setIsSelectedLine(isSelectedLine);

        console.log(players);
        console.log('---------------->' , players.filter(item => item.socketID == window.localStorage.getItem('socketID'))[0].turn );
    });

    const handleClick = (value) => {
        console.log(value);
        if(isSelectedLine[value] == 0)
            socket.emit('change_gameInfo' , value);
    }


    return (
        <div>
            <h1 style = {{fontSize: '100px'}}>Dots And Boxes</h1>
            <div className = "board">
                <div className = "players">
                    <div>
                        <button className = "start p1">Me</button>
                        <p id = "p1Score" className = "p1">{players.length > 0 ?players.filter(item => item.socketID == window.localStorage.getItem('socketID'))[0].score:0}</p>
                    </div>
                    <div>
                        <button className = "start p2">Player A</button>
                        <p id="p2Score" className="p2">{players.length > 0 ? players.filter(item => item.socketID != window.localStorage.getItem('socketID'))[0].score : 0}</p>
                    </div>
                    <div>
                        <button className = "start p3">Player B</button>
                        <p id="p3Score" className="p3">{players.length > 0 ?players.filter(item => item.socketID != window.localStorage.getItem('socketID'))[1].score : 0}</p>
                    </div>
                </div>
                <div id = "matrix" style={{
                        pointerEvents:players.length > 0 && players.filter(item => item.socketID == window.localStorage.getItem('socketID'))[0].turn == false? 'none':"" ,
                        opacity: players.length > 0 &&players.filter(item => item.socketID == window.localStorage.getItem('socketID'))[0].turn == false? 0.4: 1
                    }} >
                    <div className = "box box0" data-boxn="0" style={{ backgroundColor: isSelectedBox[0] > -1? colors[isSelectedBox[0]] : ""}}></div>
                    <div className = "dot dot1" data-box="0"></div>
                    <div className = "line line-y line1" data-line-1="0" data-line-2="-3" style = {{left: '-75px', top: '5px', dataActive: false , backgroundColor: isSelectedLine[0]==1?"orange":""}} onClick = {() => handleClick(0)}></div>
                    <div className="line line-x line1" data-line-1="0" data-line-2="-1" style = {{left: '-75px', top: '5px', dataActive: false , backgroundColor: isSelectedLine[1]==1?"orange":""}} onClick = {() => handleClick(1)}></div>

                    <div className="box box1" data-boxnum="1" style={{ backgroundColor: isSelectedBox[1] > -1? colors[isSelectedBox[1]] : ""}}></div>
                    <div className="dot dot2" data-box="1"></div>
                    <div className="line line-y line2" data-line-1="1" data-line-2="-2" data-active="false" onClick = {() => handleClick(2)} style = {{backgroundColor: isSelectedLine[2]==1?"orange":"" }}></div>
                    <div className="line line-x line2" data-line-1="1" data-line-2="0" data-active="false" onClick = {() => handleClick(3)} style = {{backgroundColor: isSelectedLine[3]==1?"orange":"" }}></div>

                    <div className="box box2" data-boxnum="2" style={{ backgroundColor: isSelectedBox[2] > -1? colors[isSelectedBox[2]] : ""}} ></div>
                    <div className="dot dot3" data-box="2"></div>
                    <div className="line line-y line3" data-line-1="2" data-line-2="-1" data-active="false" onClick = {() => handleClick(4)} style = {{backgroundColor: isSelectedLine[4]==1?"orange":"" }}></div>
                    <div className="line line-x line3" data-line-1="2" data-line-2="1" data-active="false"  onClick = {() => handleClick(5)} style = {{backgroundColor: isSelectedLine[5]==1?"orange":"" }}></div>

                    <div className="box box3" data-boxnum="3" style={{ backgroundColor: isSelectedBox[3] > -1? colors[isSelectedBox[3]] : ""}}></div>
                    <div className="dot dot4" data-box="3"></div>
                    <div className="line line-y line4" data-line-1="3" data-line-2="0" data-active="false"  onClick = {() => handleClick(6)} style = {{backgroundColor: isSelectedLine[6]==1?"orange":"" }}></div>
                    <div className="line line-x line4" data-line-1="3" data-line-2="-1" data-active="false"  onClick = {() => handleClick(7)} style = {{backgroundColor: isSelectedLine[7]==1?"orange":"" }}></div>

                    <div className="box box4" data-boxnum="4" style={{ backgroundColor: isSelectedBox[4] > -1? colors[isSelectedBox[4]] : ""}}></div>
                    <div className="dot dot5" data-box="4"></div>
                    <div className="line line-y line5" data-line-1="4" data-line-2="1" data-active="false"  onClick = {() => handleClick(8)} style = {{backgroundColor: isSelectedLine[8]==1?"orange":"" }}></div>
                    <div className="line line-x line5" data-line-1="4" data-line-2="3" data-active="false"  onClick = {() => handleClick(9)} style = {{backgroundColor: isSelectedLine[9]==1?"orange":"" }}></div>

                    <div className="box box5" data-boxnum="5" style={{ backgroundColor: isSelectedBox[5] > -1? colors[isSelectedBox[5]] : ""}}></div>
                    <div className="dot dot6" data-box="5"></div>
                    <div className="line line-y line6" data-line-1="5" data-line-2="2" data-active="false"  onClick = {() => handleClick(10)} style = {{backgroundColor: isSelectedLine[10]==1?"orange":"" }}></div>
                    <div className="line line-x line6" data-line-1="5" data-line-2="4" data-active="false"  onClick = {() => handleClick(11)} style = {{backgroundColor: isSelectedLine[11]==1?"orange":"" }}></div>

                    <div className="box box6" data-boxnum="6" style={{ backgroundColor: isSelectedBox[6] > -1? colors[isSelectedBox[6]] : ""}}></div>
                    <div className="dot dot7" data-box="6"></div>
                    <div className="line line-y line7" data-line-1="6" data-line-2="3" data-active="false"  onClick = {() => handleClick(12)} style = {{backgroundColor: isSelectedLine[12]==1?"orange":"" }}></div>
                    <div className="line line-x line7" data-line-1="6" data-line-2="-1" data-active="false"  onClick = {() => handleClick(13)} style = {{backgroundColor: isSelectedLine[13]==1?"orange":"" }}></div>

                    <div className="box box7" data-boxnum="7" style={{ backgroundColor: isSelectedBox[7] > -1? colors[isSelectedBox[7]] : ""}}></div>
                    <div className="dot dot8" data-box="7"></div>
                    <div className="line line-y line8" data-line-1="7" data-line-2="4" data-active="false"  onClick = {() => handleClick(14)} style = {{backgroundColor: isSelectedLine[14]==1?"orange":"" }}></div>
                    <div className="line line-x line8" data-line-1="7" data-line-2="6" data-active="false"  onClick = {() => handleClick(15)} style = {{backgroundColor: isSelectedLine[15]==1?"orange":"" }}></div>

                    <div className="box box8" data-boxnum="8" style={{ backgroundColor: isSelectedBox[8] > -1? colors[isSelectedBox[8]] : ""}}></div>
                    <div className="dot dot9" data-box="8"></div>
                    <div className="line line-y line9" data-line-1="8" data-line-2="5" data-active="false"  onClick = {() => handleClick(16)} style = {{backgroundColor: isSelectedLine[16]==1?"orange":"" }}></div>
                    <div className="line line-x line9" data-line-1="8" data-line-2="7" data-active="false"  onClick = {() => handleClick(17)} style = {{backgroundColor: isSelectedLine[17]==1?"orange":"" }}></div>

                    <div className="dot dot10" data-box="9"></div>
                    <div className="line line-x line10" data-line-1="2" data-line-2="-1" data-active="false"  onClick = {() => handleClick(18)} style = {{backgroundColor: isSelectedLine[18]==1?"orange":"" }}></div>
                    <div className="dot dot11" data-box="9"></div>
                    <div className="line line-x line13" data-line-1="5" data-line-2="-1" data-active="false"  onClick = {() => handleClick(19)} style = {{backgroundColor: isSelectedLine[19]==1?"orange":"" }}></div>
                    <div className="dot dot12" data-box="9"></div>
                    <div className="line line-x line11" data-line-1="8" data-line-2="-1" data-active="false"  onClick = {() => handleClick(20)} style = {{backgroundColor: isSelectedLine[20]==1?"orange":"" }}></div>
                    <div className="dot dot13" data-box="9"></div>
                    <div className="line line-y line14" data-line-1="6" data-line-2="-1" data-active="false" onClick = {() => handleClick(21)}  style = {{backgroundColor: isSelectedLine[21]==1?"orange":"" }}></div>
                    <div className="dot dot14" data-box="9"></div>
                    <div className="line line-y line12" data-line-1="7" data-line-2="-1" data-active="false" onClick = {() => handleClick(22)} style = {{backgroundColor: isSelectedLine[22]==1?"orange":"" }}></div>
                    <div className="dot dot15" data-box="9"></div>
                    <div className="line line-y line15" data-line-1="8" data-line-2="-1" data-active="false" onClick = {() => handleClick(23)} style = {{backgroundColor: isSelectedLine[23]==1?"orange":"" }}></div>
                    <div className="dot dot16" data-active="false"></div>
                </div>
                <div className="extraSpace"></div>

                <div className="connection">
                    <Link to="/board" className="start" id="start-btn">↻</Link>
                    <Link to="/" className="start" id="start-btn">⌂</Link>
                </div>

                <div className="finalScore">
                    <h1 style = {{paddingTop: '5%'}} id="message">
                        <span id="message"></span>
                    </h1>
                </div>
            </div>
        </div>
    );
};


export {Board};
