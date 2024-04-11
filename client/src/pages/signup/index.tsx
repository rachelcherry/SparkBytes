import React from "react";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { API_URL } from "../../common/constants";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utility/validationUtils";
import { Form, message, Button, Input, Row, Col } from "antd";
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
      message.error(
        "Password needs to contain at least 8 characters, one upper case letter, one lower case letter, and a number."
      );
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
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, email: email, password: pass }),
    });
    if (response.ok) {
      // const data = await response.json();
      // console.log("RESPONSE:", data.message);
      window.location.href = "../login";
    } else {
      if (response.status === 409) {
        message.error("User already exists");
        // Display a message to the user indicating that the user already exists
      } else {
        console.error("Signup didn't succeed.");
        // Display a generic error message for other types of errors
      }
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
        <h1 style={{ alignContent: "center" }}>Sign Up</h1>
        <Form
          name="signup"
          onFinish={handleSign}
          style={{ width: "100%", maxWidth: "300px" }}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your name" },
              { type: "string", message: "Invalid name format" },
            ]}
          >
            <div>
              <label>Name</label>
              <Input
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <div>
              <label>Email</label>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <div>
              <label>Password</label>
              <Input.Password
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginTop: "20px",
              backgroundColor: "#28a745",
              width: "300px",
            }}
          >
            <UserOutlined />
            Sign Up
          </Button>
          {error && <p className="error">Please enter valid information.</p>}
        </Form>

        <a
          href="/"
          style={{ marginTop: "20px", color: "blue", textDecoration: "none" }}
        >
          Back to Home
        </a>
      </div>
    </>
  );
};

export default Signup;
