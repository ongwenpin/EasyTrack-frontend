import './App.css';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';

function App() {

  return (
    <>
      <Navbar/>
      <div className="flex flex-row">
        <div className="shrink">
          <SideBar/>
        </div>
        <div className="grow">
          <Outlet/>
        </div>
        
        
      </div>
      
    </>
  )
}

export default App
