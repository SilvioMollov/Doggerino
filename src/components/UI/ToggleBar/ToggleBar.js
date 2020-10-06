import React from "react";

import "./ToggleBar.css";

const toggleBar = (props) => {
  const defaultStyle = {
    position: "relative",
    display: "block",
    width: "100px",
    height: "50px",
    margin: "30px auto",
    boxShadow: "0 0.3em 1em #000",
    borderRadius: "25px",
  };

  return (
    <>
      <div>
        <label
          style={props.style ? props.style : defaultStyle}
          className={"Toggle-Switch"}
        >
          <input type="checkbox" onClick={props.clicked} />
          <span className="Toggle-Slider round">{props.icons}</span>
        </label>
      </div>
    </>
  );
};

export default toggleBar;
