import React, { Component } from "react";
import { Flip } from "react-awesome-reveal";
import "./Match.css";

export class Match extends Component {
  state = { heartHover: false };

  onMouseHoverHandler = (e) => {
    // console.log(e.type);
    if (e.type === "mouseenter") {
      this.setState({ heartHover: true });
    } else {
      this.setState({ heartHover: false });
    }
  };

  render() {
    const {
      isAdminView,
      email,
      firstName,
      location,
      matched,
      messageHandler,
      dislikeHandler,
      viewUserProfileHandler,
    } = this.props;

    const { heartHover } = this.state;

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
          className={matched ? "Liked Matched" : "Liked"}
          onClick={viewUserProfileHandler}
        >
          <span className="Match-FirstName">{firstName}</span>
          <span className="Match-Location">{location}</span>
        </div>
      );
    }

    return (
      <div className={"Match-Wrapper"}>
        {match}
        <button
          onClick={matched ? messageHandler : null}
          className={"Match-Message"}
          style={!matched ? { display: "none" } : { display: "inline-block" }}
        >
          <i
            className={
              matched
                ? "fas fa-comment-dots Matched fa-2x"
                : "fas fa-comment-dots Liked fa-2x"
            }
          ></i>
        </button>
        <button
          onClick={dislikeHandler}
          onMouseEnter={this.onMouseHoverHandler}
          onMouseLeave={this.onMouseHoverHandler}
          className={"Match-Heart"}
        >
          {heartHover ? (
            <Flip direction="vertical" duration="300">
              <i className="fas fa-times Dislike fa-2x"></i>
            </Flip>
          ) : (
            <i
              className={
                matched
                  ? "fas fa-heart Matched fa-2x"
                  : "fas fa-heart Liked fa-2x"
              }
            ></i>
          )}
        </button>
      </div>
    );
  }
}

export default Match;
