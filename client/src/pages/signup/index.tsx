import React from "react";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utility/validationUtils";
// check if user exists and if not then create them
// three functions
// jwt.sign need this to make it work
// when you create token you have to store information
// when you create token jwt.sign(name, password,  ___ also have token (pass in secret)) then you will get a secret - which is why jwt in env which will help recieve functions

const Signup = () => {
  const [username, setUsername] = useState(""); // state for the list that contains the users numbers
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false); // state for keeping track of whether or not it is a valid input
  function handleUsername() {
    if (validateUsername(username)) {
      // if the input length is 10 and it is a valid number
      setUsername(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }
  }
  function handlePassword() {
    if (validatePassword(pass)) {
      // if the input length is 10 and it is a valid number
      setPass(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }
  }
  function handleEmail() {
    if (validateEmail(email)) {
      // if the input length is 10 and it is a valid number
      setEmail(""); // set the user input to be empty
      setError(false); // set the error to be false because it is a valid number
    } else {
      setError(true); // there was no valid number given
    }
  }
  return (
    <>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {/* <div className="error">
        {error && <p>Please enter a valid username.</p>}
      </div> */}
      <button onClick={handleUsername}>Sign Up!</button>
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
