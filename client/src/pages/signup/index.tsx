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
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);
  const handleSign = async () => {
    if (validateUsername(username)) {
      setUsername("");
      setError(false);
    } else {
      setError(true);
    }
    if (validatePassword(pass)) {
      setPass("");
      setError(false);
    } else {
      setError(true);
    }
    if (validateEmail(email)) {
      setEmail("");
      setError(false);
    } else {
      setError(true);
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
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#f0f8ea",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      ></div>
      <div
        style={{
          backgroundColor: "white",
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Sign Up</h1>
        <label style={{ width: "100%", marginBottom: "10px" }}>
          Username
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label style={{ width: "100%", marginBottom: "10px" }}>
          Email
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label style={{ width: "100%", marginBottom: "10px" }}>
          Password
          <Input.Password
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </label>
        <Button
          onClick={handleSign}
          style={{
            marginTop: "20px",
            alignContent: "center",
            backgroundColor: "#28a745",
            textAlign: "center",
            width: "200px",
            // marginLeft: "100px",
          }}
        >
          Sign Up
        </Button>
        {error && <p className="error">Please enter valid information.</p>}
        <a href="/" style={{ marginTop: "20px" }}>
          Back to Home
        </a>
      </div>
    </>
  );
};

export default Signup;
