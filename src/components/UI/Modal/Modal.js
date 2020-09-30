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
    const { show, closed, children } = this.props;

    return (
      <>
        <Backdrop show={show} clicked={closed}  />
        <div
          className={"Modal"}
          style={{
            transform: show ? "translateY(0)" : "translateY(-100vh)",
            opacity: show ? "1" : "0",
          }}
        >
          {children}
        </div>
      </>
    );
  }
}

export default Modal;
