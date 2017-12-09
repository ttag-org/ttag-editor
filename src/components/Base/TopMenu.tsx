import * as React from "react";
import { Link } from "react-router-dom";

export const TopMenu = () => {
  return (
    <div>
      <Link to={`/translate`}>Translate</Link>
      <Link to={`/all`}>All</Link>
    </div>
  );
};
