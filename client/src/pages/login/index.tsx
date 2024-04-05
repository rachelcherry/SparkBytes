import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { updateAuthToken } = useAuth(); //getting the updateAuthToken from useAuth

  const login = async (token: string) => {
    updateAuthToken(token); //calls updateAuthToken function to update authentication token
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        //we want to store the token into AuthToken if the login is successful
        login(data.token); //calls login function to store the token
        message.success("Login successful");
      } else {
        //displays an error message when there are invalid credentials
        message.error(data.message);
      }
    } catch (error) {
      console.error("Login failed: ", error);
      message.error("An error has ocurred, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ alignContent: "center" }}>Login</h1>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please input your email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email"></Input>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          ></Input.Password>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
