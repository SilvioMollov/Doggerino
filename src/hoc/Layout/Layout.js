import React, { Component } from "react";
import { connect } from "react-redux";
import "./Layout.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import Backdrop from "../../components/UI/BackDrop/BackDrop";

class Layout extends Component {
  state = {
    showSideDrawer: false,
  };

  drawerCloseHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  drawerOpenHandler = () => {

    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    let sideDrawer;

    if (this.state.showSideDrawer) {
      sideDrawer = (
        <>
          <SideDrawer
            //   isAuth={this.props.isAuth}
            open={this.drawerOpenHandler}
            closed={this.drawerCloseHandler}
          />
          <Backdrop show={this.state.showSideDrawer} clicked={this.drawerCloseHandler}></Backdrop>
        </>
      );
    } else {
      sideDrawer = null;
    }

    return (
      <>
        <Toolbar drawerClickHandler={this.drawerOpenHandler} />
        {sideDrawer}

        <main className={"Layout-Content"}>{this.props.children}</main>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
