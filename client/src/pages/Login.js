import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setAuthState } = React.useContext(AuthContext);

  const handleLogin = () => {
    axios
      .post("http://localhost:3001/auth/login", {
        username: username,
        password: password,
      })
      .then((resp) => {
        if (resp.data.error) {
          alert(resp.data.error);
        } else {
          localStorage.setItem("accessToken", resp.data.token);
          setAuthState({
            username: resp.data.username,
            id: resp.data.id,
            status: true,
          });
          navigate("/");
        }
      });
  };

  return (
    <div className="loginDiv">
      <h2>Log In</h2>
      <input
        className="Inp"
        placeholder="username..."
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      ></input>
      <input
        className="Inp"
        type="password"
        placeholder="password..."
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button className="Inp" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
