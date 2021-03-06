import React from "react";
import "./CardHolder.css";
import img from "../../../../Assets/DOGS.jpg";
import img2 from "../../../../Assets/images.jpg";

const cardHolder = (props) => {
  let form = null;

  if (props.isDog) {
    form = (
      <div className="CardHolder">
        <div className="ImgHolder">
          <img
            src={props.isDog ? img2 : img}
            alt="Dogs"
            className={"ImgSize"}
          />
        </div>
        <div className="CardHolder-Description">
          <span className="Description-Name">{props.petName}</span>
          <span className="Description-LastName">{props.matchLastName},</span>
          <span className="Description-UserAge">{props.petAge}</span>
          <span className="Description-Location">{props.petBreed}</span>
        </div>
      </div>
    );
  } else {
    form = (
      <div className="CardHolder">
        <div className="ImgHolder">
          <img
            src={props.isDog ? img2 : img}
            alt="Dogs"
            className={"ImgSize"}
          />
        </div>
        <div className="CardHolder-Description">
          <span className="Description-Name">{props.matchFirstName}</span>
          <span className="Description-LastName">{props.matchLastName},</span>
          <span className="Description-UserAge">{props.userAge}</span>
          <span className="Description-Location">{props.matchLocation}</span>
        </div>
      </div>
    );
  }

  if (props.filteredMatchesLength === 0) {
    form = <div className="CardHolder">There are no new Users to show</div>;
  }

  return form;
};

export default cardHolder;
