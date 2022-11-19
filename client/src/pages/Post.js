import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

function Post() {
  const navigate = useNavigate();
  const [postObj, setPostObj] = React.useState({});
  const [comments, setComments] = React.useState([]);

  const [newComment, setNewComment] = React.useState("");

  const { authState } = React.useContext(AuthContext);

  let { id } = useParams();

  React.useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      Axios.get(`http://localhost:3001/posts/byId/${id}`).then((resp) => {
        setPostObj(resp.data);
      });
      Axios.get(`http://localhost:3001/comments/${id}`).then((resp) => {
        setComments(resp.data);
      });
    }
  }, []);

  const handleSubmitComment = () => {
    Axios.post(
      "http://localhost:3001/comments",
      {
        commentBody: newComment,
        PostId: id,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((resp) => {
      if (resp.data.error) {
        console.log(resp.data.error);
      } else {
        setComments([...comments, resp.data]);
        setNewComment("");
      }
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const handleDeletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  const handleUpdate = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title.");
      axios.put(
        "http://localhost:3001/posts/title",
        { newTitle: newTitle, id: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObj({ ...postObj, title: newTitle });
    } else {
      let newText = prompt("Enter new text.");
      axios.put(
        "http://localhost:3001/posts/text",
        { newText: newText, id: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObj({ ...postObj, postText: newText });
    }
  };

  return (
    <div className="pagePost">
      <div className="card">
        <div className="postDeets">
          <div
            className="postTitle"
            onClick={() => {
              if (authState.username === postObj.username) {
                handleUpdate("title");
              }
            }}
          >
            {postObj.title}
          </div>
          <div
            className="postText"
            onClick={() => {
              if (authState.username === postObj.username) {
                handleUpdate("text");
              }
            }}
          >
            {postObj.postText}
          </div>
        </div>
        <div className="user">
          user: {postObj.username}
          {authState.username === postObj.username && (
            <button
              className="dltPost"
              onClick={() => {
                handleDeletePost(postObj.id);
              }}
            >
              Delete Post
            </button>
          )}
        </div>
      </div>

      <div className="comment">
        <div className="inputs">
          <input
            placeholder="Type your comment.."
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            value={newComment}
          ></input>
          <button onClick={handleSubmitComment}>Submit Comment</button>
        </div>

        <div className="listComments">
          {comments.map((value, key) => {
            return (
              <div key={key} className="eachComment">
                <div>
                  "{value.commentBody}"-<label> @{value.username}</label>
                </div>

                <div className="eachCommentDiv2">
                  {value.username === authState.username && (
                    <button
                      className="commentDelete"
                      onClick={() => {
                        handleDelete(value.id);
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
