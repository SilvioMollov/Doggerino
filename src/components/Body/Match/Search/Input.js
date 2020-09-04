import React from "react";
import "./Input.css";
const input = (props) => {
  let inputElement = null;

  const inputClasses = ["InputElement"];

  if (props.inValid && props.shouldValidate && props.touched) {
    inputClasses.push("Invalid");
  }

  switch (props.elType) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={input.inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }

  let validationError= null
  if(props.invalid && props.touched) {
  validationError = <p>Please enter a valid {props.valueType}</p>
  }

  return (
    <div className="Search">
      <label>{props.label}</label>
      {inputElement}
      <button>Go!</button>
    </div>
  );
};

export default input;
