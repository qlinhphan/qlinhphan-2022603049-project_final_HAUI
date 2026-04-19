import logo from './logo.svg';
import './App.css';
import { Outlet, useLocation } from 'react-router';
import HeaderClient from './client/homepage/headerClient';
import FooterClient from './client/homepage/footerClient';

function App() {
  const location = useLocation();

  const isAdmin = location.pathname.includes("admin");
  return (
    <div className="App">
      <div>
        {/* <HeaderClient></HeaderClient> */}
        {!isAdmin && <HeaderClient></HeaderClient>}
      </div>
      <div>
        <Outlet></Outlet>
      </div>
      <div>
        {/* <FooterClient></FooterClient> */}
        {!isAdmin && <FooterClient></FooterClient>}
      </div>
    </div>
  );
}

export default App;
