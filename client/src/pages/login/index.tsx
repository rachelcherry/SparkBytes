import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from ".../AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onComplete = async (values) => {
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
        login(data.token);
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

  return <div>Login</div>;
};

export default Login;
