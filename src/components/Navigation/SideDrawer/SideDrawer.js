import React from "react";
import NavigationItems from "../NavigationItems";
import "./SideDrawer.css";

const sideDrawer = (props) => {
  let drawerClasses = "SideDrawer";

  if (props.isOpen) {
    drawerClasses = "SideDrawer Open";
  }

  return (
    <>
      <nav className={drawerClasses}>
        <NavigationItems isAuthenticated={props.isAuth} onClick = {props.clicked} />
      </nav>
    </>
  );
};

export default sideDrawer;
