import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { message, Button, Form, Input, DatePicker } from "antd";
import { API_URL } from "../../common/constants";
import { AuthContext } from "@/contexts/AuthContext";

function CreateEvent() {
  const router = useRouter();
  const { authState } = useContext(AuthContext);

  const [data, setData] = useState({
    exp_time: "",
    description: "",
    qty: "",
    tags: [],
    location: "",
  });

  const handleCreateEvent = async () => {
    try {
      console.log(data);
      const eventData = {
        ...data,
        exp_time: new Date(data.exp_time).toISOString(),
        qty: String(data.qty),
      };
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState?.token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        message.success("Event Successfully Created");
        router.push("/events");
        console.log(response);
      } else {
        if (response.status === 409) {
          message.error("Event not Successfully Created");
        } else if (response.status === 403) {
          message.error("You do not have permission to create events");
        }
      }
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("Failed to create event. Please try again.");
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    if (!e.target) return; // Check if e.target exists

    const { name, value } = e.target;
    let updatedValue: string | number[] | number;

    if (name === "quantity") {
      updatedValue = String(value);
    } else if (name === "tags") {
      // Split the input value by comma and trim each tag
      updatedValue = value.split(",").map(Number);
    } else {
      // For other input fields, just update the value
      updatedValue = value;
    }
    setData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "25%",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "5%",
        left: "40%",
      }}
    >
      <h1 style={{ alignContent: "center", fontFamily: "Arial" }}>
        Create Event
      </h1>
      <Form title="Create Event" style={{ width: "100%", maxWidth: "300px" }}>
        <Form.Item label="Expiration Time" name="exp_time">
          <Input
            type="date"
            name="exp_time"
            value={data.exp_time}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input
            name="description"
            value={data.description}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Quantity" name="qty">
          <Input
            type="number"
            name="qty"
            value={data.qty}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Input name="tags" value={data.tags} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button onClick={handleCreateEvent}>Create</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default CreateEvent;
