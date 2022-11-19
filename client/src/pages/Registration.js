import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const navigate = useNavigate();

  const onSubmit = (data) => {
    Axios.post("http://localhost:3001/auth", data).then((resp) => {
      if (resp.data.error) {
        alert(resp.data.error);
      } else {
        navigate("/");
      }
    });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(15).required(),
  });

  return (
    <div className="formContainer">
      <h2>Sign up</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formCard">
          <label>username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="username..."
          />

          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputCreatePost"
            name="password"
            type="password"
            placeholder="password..."
          />

          <button type="submit">Sign up</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
