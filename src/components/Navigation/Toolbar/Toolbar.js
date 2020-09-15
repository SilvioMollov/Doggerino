import React from "react";
import "./Toolbar.css";
import NavigationItems from "../NavigationItems";
import DrawerToggle from ".././SideDrawer/DrawerToggle/DrawerToggle";
import { NavLink } from "react-router-dom";

const toolbar = (props) => {
  return (
    <header className={"Toolbar"}>
      <nav className={"Toolbar-Navigation"}>
        <DrawerToggle clicked={props.drawerClickHandler} />

        <div className="Toolbar-Logo">
          <NavLink to="/match" className="Toolbar-NavLinks">
            <i className="fas fa-dog"></i>
            Doggerino
          </NavLink>
        </div>
        <div className="Toolbar-Spacer"></div>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
};

export default toolbar;
