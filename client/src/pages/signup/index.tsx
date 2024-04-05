import React from "react";
import { useState } from "react";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utility/validationUtils";
import { Button, Input, Row, Col } from "antd";
// check if user exists and if not then create them
// three functions
// jwt.sign need this to make it work
// when you create token you have to store information
// when you create token jwt.sign(name, password,  ___ also have token (pass in secret)) then you will get a secret - which is why jwt in env which will help recieve functions
// name, email, password

const Signup = () => {
  const [username, setUsername] = useState(""); // state for the list that contains the users numbers
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false); // state for keeping track of whether or not it is a valid input
  const handleSign = async () => {
    if (validateUsername(username)) {
      // if the input length is 10 and it is a valid number
      setUsername(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }
    if (validatePassword(pass)) {
      // if the input length is 10 and it is a valid number
      setPass(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }
    if (validateEmail(email)) {
      // if the input length is 10 and it is a valid number
      setEmail(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }

    // create json with three of those and format

    // create http request in typescript method, headers, body
    const response = await fetch("http://localhost:5005/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, email: email, password: pass }),
    });
    if (response.ok) {
      window.location.href = "../login/index";
    } else {
      console.error("Signup did not succeed.");
    }
    // if response 200, go to login
    // if response 400, _____
  };
  return (
    <>
      <Input.Group>
        <Input placeholder="Username" />
        <Input placeholder="Email" />
        <Input.Password placeholder="Password" />
        <Button onClick={handleSign}>Sign Up!</Button>
      </Input.Group>

      {/* <div className="error">
        {error && <p>Please enter a valid username.</p>}
      </div> */}

      {/* <div className="error">
        {error && <p>Please enter a valid username.</p>}
      </div>
      <div className="error">
        {error && <p>Please enter a valid username.</p>}
      </div>
      <button onClick={handleUsername}>Add</button>
      <div className="error">
        {error && <p>Please enter a valid username.</p>}
      </div> */}
    </>
  );
};

export default Signup;
