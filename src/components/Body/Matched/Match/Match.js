import React from "react";
import "./Match.css";

const match = (props) => {
  const {
    isAdminView,
    email,
    firstName,
    location,
    matched,
    clickHandler,
  } = props;

  let match = null;

  if (isAdminView) {
    match = (
      <div className={"Match-AdminView"} onClick={clickHandler}>
        <p className={"Match-FirstName"}>{firstName}</p>
        <p>{email}</p>
      </div>
    );
  } else {
    match = (
      <div
        className={matched ? "Matched" : "Liked"}
        onClick={matched ? clickHandler : null}
      >
        <span className="FirstName">first Name: {firstName}</span>
        <span>location: {location}</span>
      </div>
    );
  }

  return <div>{match}</div>;
};

export default match;
