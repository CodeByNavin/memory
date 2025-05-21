import { Route, Routes, HashRouter } from 'react-router-dom';
import MainPage from './main/App';
import Game from './game/App';

export default function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </HashRouter>
  )
};