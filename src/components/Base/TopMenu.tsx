import * as React from "react";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";

const menuLinkStyle = {
  color: "white"
};

export const TopMenu = () => {
  return (
    <div>
      <Link to={`/translate`}>
        <FlatButton>
          <span style={menuLinkStyle}>Translate</span>
        </FlatButton>
      </Link>
      <Link to={`/all`}>
        <FlatButton>
          <span style={menuLinkStyle}>All</span>
        </FlatButton>
      </Link>
    </div>
  );
};
