import * as React from "react";
import { Link } from "react-router-dom";

const titleStyle = {
  color: "white",
  textDecoration: "none"
};

export const EditorTitle = () => {
  return <Link to="/" style={titleStyle}>c-3po editor</Link>;
};
