import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './client/homepage/homePage';
import Analysist from './client/analysist/analysist';
import Patient from './client/patient/patient';
import ManageUser from './admin/manage-user/manageUser';
import ManagePatient from './admin/manage-patient/managePatient';
import ManageRole from './admin/manage-role/manageRole';
import ManageDashboard from './admin/dashboard/manageDashboard';
import Logins from './login/logins';
import { Provider } from 'react-redux';
import store from './redux/stores';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>

        <Routes>
          <Route path="/login" element={<Logins />} >
          </Route>
        </Routes>

        <Routes>
          <Route path="/*" element={<App />} >
            <Route index element={<HomePage />}></Route>
            <Route path="analysist" element={<Analysist />}></Route>
            <Route path="patient" element={<Patient />}></Route>
          </Route>
        </Routes>

        <Routes>
          <Route path="/admin" element={<App />} >
            <Route path="dashboard" element={<ManageDashboard />}></Route>
            <Route index element={<ManageUser />}></Route>
            <Route path="patients" element={<ManagePatient />}></Route>
            <Route path="roles" element={<ManageRole />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </React.StrictMode>
  </Provider >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
