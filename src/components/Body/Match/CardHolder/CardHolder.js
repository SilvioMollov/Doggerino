import React from "react";
import "./CardHolder.css";
import img from "../../../../Assets/DOGS.jpg";


const cardHolder = (props) => {
  const style = {
    width: "100%",
    height: "400px",
  };


  let form = (
    <div className= "CardHolder">
      <p className="Description">Name: {props.matchName}</p>

      <div className="ImgHolder">
        <img src={img} alt="Dogs" style={style} />
      </div>

      <p className="Description">Location: {props.matchLocation}</p>
    </div>
  );
  

  if (props.filteredMatchesLength === 0) {
    form = <div className="CardHolder">No data to show</div>;
  }

  return  form ;
};

export default cardHolder;
