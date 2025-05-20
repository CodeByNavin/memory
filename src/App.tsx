import { Route, Routes } from 'react-router-dom';
import MainPage from './main/App';
import Game from './game/App';

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
};