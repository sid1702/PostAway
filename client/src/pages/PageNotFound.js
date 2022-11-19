import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <h1>This page does not exist :/</h1>
      <Link to="/">Go to Home page</Link>
    </div>
  );
}

export default PageNotFound;
