import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AuthContext } from "../helpers/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const [listPost, setListPost] = React.useState([]);
  const [likedPosts, setLikedPosts] = React.useState([]);
  const { authState } = React.useContext(AuthContext);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      Axios.get("http://localhost:3001/posts", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((resp) => {
        setListPost(resp.data.allPosts);
        setLikedPosts(
          resp.data.likedPosts.map((i) => {
            return i.PostId;
          })
        );
      });
    }
  }, []);

  const handleLike = (id) => {
    Axios.post(
      "http://localhost:3001/likes",
      { PostId: id },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((resp) => {
      setListPost(
        listPost.map((post) => {
          if (post.id === id) {
            if (resp.data.liked) {
              return { ...post, Likes: [...post.Likes, 0] };
            } else {
              const likedArr = post.Likes;
              likedArr.pop();
              return { ...post, Likes: likedArr };
            }
          } else {
            return post;
          }
        })
      );

      if (likedPosts.includes(id)) {
        setLikedPosts(
          likedPosts.filter((i) => {
            return i !== id;
          })
        );
      } else {
        setLikedPosts([...likedPosts, id]);
      }
    });
  };

  return (
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
              <p>{value.title}</p>
              <p>{value.postText}</p>
            </div>
            <div className="user">
              <div className="likes">
                <ThumbUpIcon
                  onClick={() => {
                    handleLike(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                <label className="likesLength">{value.Likes.length}</label>
              </div>

              <Link to={`/profile/${value.UserId}`} className="usernameLink">
                @{value.username}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
