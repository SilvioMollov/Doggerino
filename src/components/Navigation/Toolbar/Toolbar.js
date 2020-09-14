import React from "react";
import "./Toolbar.css";
import NavigationItems from "../NavigationItems";
import DrawerToggle from ".././SideDrawer/DrawerToggle/DrawerToggle";

const toolbar = (props) => {
  return (
    <header className={"Toolbar"}>
      <nav className={"Toolbar-Navigation"}>
        <div>
          <DrawerToggle clicked={props.drawerClickHandler} />
        </div>

        <div className="Toolbar-Logo">
          <a href="/">THE LOGO</a>
        </div>
        <div className="Toolbar-Spacer"></div>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
};

export default toolbar;
