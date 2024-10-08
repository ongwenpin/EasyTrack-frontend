import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from './pages/Dashboard.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { UsersList } from './pages/UsersList.jsx';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { User } from './pages/User.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import RecordsList from './pages/RecordsList.jsx';
import Record from './pages/Record.jsx';
import Expense from './pages/Expense.jsx';
import ExpenseList from './pages/ExpenseList.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

// If path unknown, redirect to some page
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>
  },
  {
    path: "/signup",
    element: <SignUpPage/>
  },
  {
    element: <ProtectedRoutes/>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      {
        path: "/users",
        element: <UsersList/>
      },
      {
        path: "/user/:username?",
        element: <User/>
      },
      {
        path: "/verify/:verify_key?",
        element: <EmailVerificationPage/>
      },
      {
        path: "/records",
        element: <RecordsList/>
      },
      {
        path: "/record/:id?",
        element: <Record/>
      },
      {
        path: "/expense/:id?",
        element: <Expense/>
      },
      {
        path: "/expenses",
        element: <ExpenseList/>
      },
      {
        path: "settings",
        element: <SettingsPage/>
      }
    
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <RouterProvider router={router}/>
    </PersistGate>
  </Provider>,
)