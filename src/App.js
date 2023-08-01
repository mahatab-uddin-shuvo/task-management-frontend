import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Cookies from "universal-cookie";

import ProtectedRoute from "./helpers/ProtectedRoute";
import Forbidden from "./pages/NotFound/Forbidden.jsx";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

import TaskCreation from "./pages/TaskCreation";
import TaskCreationCreate from "./pages/TaskCreation/TaskCreationCreate";
import TaskCreationEdit from "./pages/TaskCreation/TaskCreationEdit";

import TaskAssignment from "./pages/TaskAssignment";
import TaskAssignmentCreate from "./pages/TaskAssignment/TaskAssignmentCreate";


const App = () => {
  const cookies = new Cookies();
  const [loggedIn, setLoggedIn] = React.useState(false);

  // const loginStatus = cookies.get('userAuth')?.token != null;

  // if(loggedIn !== loginStatus) {setLoggedIn(loginStatus)};

  useEffect(() => {
    if (cookies.get("userAuth")?.token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {cookies.get("userAuth") != true && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </>
          )}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TaskCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-creation"
            element={
              <ProtectedRoute>
                <TaskCreation />
              </ProtectedRoute>
            }
          
          />
          <Route
            path="/task-creation/create"
            element={
              <ProtectedRoute>
                <TaskCreationCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task-creation/edit/:id"
            element={
              <ProtectedRoute>
                <TaskCreationEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task-assignment"
            element={
              <ProtectedRoute>
                <TaskAssignment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task-assignment/create"
            element={
              <ProtectedRoute>
                <TaskAssignmentCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forbidden"
            element={
              <ProtectedRoute>
                <Forbidden />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

          {/* <Route path="/productList" element={<ProductList />} />
              <Route path="/iconList" element={<Icon />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};
export default App;
