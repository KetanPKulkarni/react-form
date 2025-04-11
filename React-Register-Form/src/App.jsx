import { Route, Routes } from 'react-router-dom';
import './App.css';
import Forgot from './Forgot';
import Login from './Login';
import Register from './Register';
import Found from './Found';
import Dashboard from './Dashboard';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/forgot" element={<Forgot/>} />
        <Route path="/register" element={<Register />} />
        <Route path='*' element={<Found/>}/>
      </Routes>
    </>
  );
}

export default App;
