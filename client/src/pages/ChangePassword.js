import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");

  const handleChangePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        { oldPass: oldPass, newPass: newPass },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((resp) => {
        if (resp.data.error) {
          alert(resp.data.error);
        } else {
          navigate("/");
        }
      });
  };

  return (
    <div className="passwordChangeDiv">
      <input
        type="password"
        placeholder="old password..."
        onChange={(e) => {
          setOldPass(e.target.value);
        }}
      ></input>
      <input
        type="password"
        placeholder="new password..."
        onChange={(e) => {
          setNewPass(e.target.value);
        }}
      ></input>
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
}

export default ChangePassword;
