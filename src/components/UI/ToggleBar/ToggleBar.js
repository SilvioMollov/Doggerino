import React from "react";
import { AttentionSeeker } from "react-awesome-reveal";

import "./ToggleBar.css";

const toggleBar = (props) => {
  const defaultStyle = {
    position: "relative",
    display: "block",
    width: "100px",
    height: "50px",
    margin: "30px auto",
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
