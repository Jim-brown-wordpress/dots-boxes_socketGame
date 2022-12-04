import './assets/styles/style.css';

import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';

import {Home} from './components/Home';
import {Board} from './components/Board';
import {Result} from './components/Result';


export const MAXN = 3;

function App() {
  return (
    <div>
        <Router>
          <Routes>
            <Route path = "*" element = {<Home />} />
            <Route path = '/board' element = {<Board />} />
            <Route path = '/result' element = {<Result />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
