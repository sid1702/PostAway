import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

function App() {
  const [authState, setAuthState] = React.useState({
    username: "",
    id: 0,
    status: false,
  });

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((resp) => {
        if (resp.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: resp.data.username,
            id: resp.data.id,
            status: true,
          });
        }
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="navbar">
            <div>
              {!authState.status ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/registration">Sign up</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home page</Link>
                  <Link to="/createPost">Create new post</Link>
                </>
              )}
            </div>

            {authState.status && (
              <div className="userProfile">
                <button className="logOutBtn" onClick={handleLogout}>
                  Log out
                </button>
                <h2>{authState.username}</h2>
              </div>
            )}
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
