import React from "react";
import NavigationItems from "../NavigationItems";
import "./SideDrawer.css";


const sideDrawer = (props) => {
  return (
    <>
      <nav className={"SideDrawer"}>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </>
  );
};

export default sideDrawer;
