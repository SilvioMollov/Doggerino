import React, { Component } from "react";
import "./Modal.css";
import Backdrop from "../BackDrop/BackDrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    const { props } = this;

    return (
      <>
        <Backdrop show={props.show} clicked={props.closed} />
        <div
          className={"Modal"}
          style={{
            transform: props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: props.show ? "1" : "0",
          }}
        >
          {props.children}
        </div>
      </>
    );
  }
}

export default Modal;
