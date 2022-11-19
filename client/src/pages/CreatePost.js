import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
  };

  const onSubmit = (data) => {
    Axios.post("http://localhost:3001/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((resp) => {
      navigate("/");
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  return (
    <div className="formContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formCard">
          <label>Title:</label>
          <ErrorMessage name="title" component="span" />
          <Field id="inputCreatePost" name="title" placeholder="title..." />

          <label>Post:</label>
          <ErrorMessage name="postText" component="span" />
          <Field id="inputCreatePost" name="postText" placeholder="text..." />

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
