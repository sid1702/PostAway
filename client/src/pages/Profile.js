import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function Profile() {
  const [username, setUsername] = React.useState("");
  const [listPost, setListPost] = React.useState([]);
  const { authState } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const { id } = useParams();
  React.useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((resp) => {
      setUsername(resp.data.username);
    });
    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((resp) => {
      setListPost(resp.data);
    });
  }, []);
  return (
    <div className="profilePage">
      <div className="basicInfo">
        <h1>username:{username}</h1>
        {authState.username === username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
            className="updBtn"
          >
            Update Password
          </button>
        )}
      </div>

      <h2>Posts created by :{username}</h2>
      <div className="listOfPosts">
        <div className="main">
          {listPost.map((value, key) => {
            return (
              <div key={key} className="card">
                <div
                  className="postDeets"
                  onClick={() => {
                    navigate(`/post/${value.id}`);
                  }}
                >
                  <p>title: {value.title}</p>
                  <p>post:{value.postText}</p>
                </div>
                <div className="user">
                  <div className="likes">
                    <ThumbUpIcon></ThumbUpIcon>
                    <label className="likesLength">{value.Likes.length}</label>
                  </div>

                  <label>@{value.username}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
