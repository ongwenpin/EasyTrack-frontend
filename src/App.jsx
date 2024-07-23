import './App.css';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';

function App() {

  return (
    <>
      {/* <div className="sticky top-0 z-20">
        <Navbar/>
      </div> */}
      <div className="flex flex-row">
        <div className="shrink z-20">
          <SideBar/>
        </div>
        <div className="grow flex flex-col">
          <div className="sticky top-0 z-20">
            <Navbar/>
          </div>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default App
