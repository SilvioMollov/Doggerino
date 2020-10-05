import React from "react";
import { AttentionSeeker } from "react-awesome-reveal";

import "./ToolTip.css";

const toolTip = (props) => {
  return (
    <>
      <div className="ToolTip-Inner">
        <AttentionSeeker effect="headShake">
          <span>
            <i className="fas fa-question" />
          </span>
        </AttentionSeeker>

        <h1>{props.header}</h1>
        <p>{props.content}</p>
      </div>
      {props.children}
    </>
  );
};

export default toolTip;
