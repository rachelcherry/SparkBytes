import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/common/constants";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utility/validationUtils";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { updateAuthToken } = useAuth(); //getting the updateAuthToken from useAuth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const login = async (token: string) => {
    updateAuthToken(token); //calls updateAuthToken function to update authentication token
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      //const { email, password } = values;
      //need to validate the email and password before moving forward, if either is not validated we send an error
      if (!validateEmail(email) || !validatePassword(password)) {
        message.error("Invalid email or password");
        setError(true);
        setLoading(false);
      } else {
        setEmail(""); //reset the email to empty string
        setPassword(""); //reset the password to empty string
        setError(false);
      }
      //create http request
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();
      // console.log(data);
      // alert(data); // uncomment to see data

      if (data.status == 200) {
        //we want to store the token into AuthToken if the login is successful
        login(data.token); //calls login function to store the token
        message.success("Login successful");
        //now that user has successfully logged in, we send them to the home page
        window.location.href = "../events";
      } else {
        //displays an error message when there are invalid credentials
        message.error(data.message);
        console.error("Login did not succeed.");
      }
    } catch (error) {
      console.error("Login failed: ", error);
      message.error("An error has ocurred, please try again later.");
    } finally {
      setLoading(false);
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
        <h1 style={{ alignContent: "center" }}>Login</h1>
        <Form
          name="login"
          onFinish={handleLogin}
          style={{ width: "100%", maxWidth: "300px" }}
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <div>
              <label>Email</label>
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
            </div>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <div>
              <label>Password</label>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input.Password>
            </div>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              marginTop: "20px",
              backgroundColor: "#28a745",
              width: "300px",
            }}
          >
            <HomeOutlined />
            Login
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

export default Login;
