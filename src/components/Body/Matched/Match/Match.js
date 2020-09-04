import React from "react";
import "./Match.css";

const match = (props) => {
  const match = (
    <div
      className={props.matched ? "Matched" : "Liked"}
      onClick={props.matched ? props.clickHandler : null}
    >
      <span className="FirstName">first Name: {props.firstName}</span>
      <span>location: {props.location}</span>
    </div>
  );

  return <div>{match}</div>;
};

export default match;
