import React from "react";
import "./Match.css";

const match = (props) => {
  const {
    isAdminView,
    email,
    firstName,
    location,
    matched,
    messageHandler,
    dislikeHandler,
  } = props;

  let match = null;

  if (isAdminView) {
    match = (
      <div className={"Match-AdminView"} onClick={messageHandler}>
        <p className={"Match-FirstName"}>{firstName}</p>
        <p>{email}</p>
      </div>
    );
  } else {
    match = (
      <div
        className={matched ? "Matched" : "Liked"}
        onClick={matched ? messageHandler : null}
      >
        <span className="Match-FirstName">{firstName}</span>
        <span className='Match-Location'>{location}</span>
      </div>
    );
  }

  return (
    <div className={"Match-Wrapper"}>
      {match}
      <button onClick={matched ? messageHandler : null}>Message</button>
      <button onClick={dislikeHandler}>DisLike</button>
    </div>
  );
};

export default match;
