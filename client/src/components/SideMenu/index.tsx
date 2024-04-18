import React, { useState, useEffect } from "react";
import {
  LogoutOutlined,
  CalendarOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { Menu, Modal, Form, Input, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "../../common/constants";

function SideMenu() {
  const router = useRouter();
  const pathname = router.pathname;
  const [selectedKeys, setSelectedKeys] = useState(pathname);
  const [modal, setModal] = useState(false);
  const [tagIdToNameMap, setTagIdToNameMap] = useState<{
    [key: number]: string;
  }>({}); // State for tagIdToNameMap

  const { clearAuthState } = useAuth();

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  useEffect(() => {
    // Fetch tag data and construct tagIdToNameMap when the component mounts
    const fetchTagData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tags`); // Adjust the API endpoint accordingly
        if (!response.ok) {
          throw new Error("Failed to fetch tag data");
        }
        const tagData = await response.json(); // Assuming your API returns JSON data and it matches the ITag interface

        // Construct tagIdToNameMap dynamically
        const map: { [key: number]: string } = {};
        tagData.forEach((tag: { tag_id: number; name: string }) => {
          map[tag.tag_id] = tag.name;
        });
        setTagIdToNameMap(map);
      } catch (error) {
        console.error("Error fetching tag data:", error);
      }
    };

    fetchTagData(); // Call the fetchTagData function
  }, []); // Empty dependency array ensures this effect runs only once, when the component mounts

  const signOut = () => {
    clearAuthState();
    router.push("/");
  };
  const [data, setData] = useState({
    exp_time: "",
    description: "",
    qty: "",
    tags: [],
    location: "",
  });

  const showModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleCreateEvent = async () => {
    try {
      const token = localStorage.getItem("token");
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData), // Send the data object
      });

      if (response.ok) {
        // Redirect to the events page using router
        setModal(false);
        message.success("Event Successfully Created");
        router.push("/events");
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
    let updatedValue: string | number[];

    if (name === "quantity") {
      // Convert value to string for quantity field
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
    <div className="SideMenu">
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          } else if (item.key === "/events/create") {
            showModal();
          } else {
            router.push(item.key);
          }
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Example Protected Route",
            key: "/protected",
            icon: <HomeOutlined />,
          },
          {
            label: "Events",
            key: "/events",
            icon: <CalendarOutlined />,
          },
          {
            label: "Create Event",
            key: "/events/create",
            icon: <PlusOutlined />,
          },
        ]}
      ></Menu>
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          }
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Sign Out",
            key: "signOut",
            icon: <LogoutOutlined />,
          },
        ]}
      ></Menu>
      <Modal
        title="Create Event"
        open={modal}
        onCancel={closeModal}
        onOk={handleCreateEvent}
      >
        <Form>
          <Form.Item label="Expiration Time" name="exp_time">
            <Input
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
            <Input name="qty" value={data.qty} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input name="tags" value={data.tags} onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default SideMenu;
