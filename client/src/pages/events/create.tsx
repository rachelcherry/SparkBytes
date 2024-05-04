import { useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  message,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import { API_URL } from "../../common/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { ITag, ILocation } from "@/common/interfaces";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { Upload } from "antd";

const { Option } = Select;

function CreateEvent() {
  const router = useRouter();
  const { authState } = useContext(AuthContext);
  const [tags, setTags] = useState<ITag[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const result = fileReader.result;
        if (typeof result === "string" && result.startsWith("data:")) {
          resolve(result.split(",")[1]);
        } else {
          reject(new Error("Invalid file format or empty result"));
        }
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleChange = async (info: any) => {
    let newFileList: any[] = [...info.fileList];

    newFileList = newFileList.slice(-10);
    setFileList(newFileList);
    console.log(newFileList);
  };
  const handleCreateEvent = async (values: any) => {
    let {
      exp_time,
      description,
      qty,
      tags,
      location_address,
      location_floor,
      location_room,
      location_note,
      locationID,
    } = values;

    const myImages = await Promise.all(
      fileList.map((file) => convertToBase64(file.originFileObj as File))
    );
    if (tags == undefined) {
      tags = [];
    }

    try {
      if (locationID) {
        let location = locations.filter(
          (location) => (location.id = locationID)
        )[0];
        location_address = location.Address;
        location_floor = location.floor;
        location_room = location.room;
        location_note = location.loc_note;
      }
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState?.token}`,
        },
        body: JSON.stringify({
          exp_time,
          description,
          qty: qty.toString(),
          tags,
          location: {
            Address: location_address,
            floor: parseInt(location_floor),
            room: location_room,
            loc_note: location_note,
          },
          photos: myImages,
        }),
      });

      if (response.ok) {
        message.success("Event Successfully Created");
        router.push("/events");
        const data = await response.json();
        console.log(data);
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

  const getTags = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/tags/`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [authState?.token]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  const getLocations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/locations/`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, [authState?.token]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  const handleShowCreateLocation = () => {
    setShowCreateLocation(true);
  };

  const handleShowExistingLocations = () => {
    setShowCreateLocation(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "75%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "5%",
          left: "19%",
        }}
      >
        <h1 style={{ alignContent: "center", fontFamily: "Arial" }}>
          Create Event
        </h1>
        <Form
          title="Create Event"
          style={{ width: "100%" }}
          onFinish={handleCreateEvent}
          layout="vertical"
        >
          <Form.Item
            label="Expiration Time"
            name="exp_time"
            rules={[
              { required: true, message: "Please enter an expiration time" },
            ]}
            style={{ width: "100%" }}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
            style={{ width: "100%" }}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="qty"
            rules={[{ required: true, message: "Please enter a quantity" }]}
            style={{ width: "100%" }}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              onChange={handleChange}
              multiple={true}
            >
              {fileList.length < 10 && (
                <Button icon={<UploadOutlined />}>Upload</Button>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Tags" name="tags" style={{ width: "100%" }}>
            <Select mode="multiple" allowClear>
              {tags.map((tag) => (
                <Option key={tag.tag_id} value={tag.tag_id}>
                  {" "}
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ marginBottom: "20px" }}>
            <Button onClick={handleShowExistingLocations}>
              Select from existing locations
            </Button>
            <Button onClick={handleShowCreateLocation}>
              Create new location
            </Button>
          </div>
          {showCreateLocation ? (
            <div>
              <Form.Item
                label="Address"
                name="location_address"
                style={{ width: "100%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Floor"
                name="location_floor"
                style={{ width: "100%" }}
              >
                <Input type="number" min={0} />
              </Form.Item>
              <Form.Item
                label="Room"
                name="location_room"
                style={{ width: "100%" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Note"
                name="location_note"
                style={{ width: "100%" }}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </div>
          ) : (
            <Form.Item
              label="Location"
              name="locationID"
              style={{ width: "100%" }}
            >
              <Select allowClear>
                {locations.map((loc) => (
                  <Option key={loc.id} value={loc.id}>
                    {loc.Address}, Floor: {loc.floor}, Room: {loc.room}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item style={{ textAlign: "center", width: "100%" }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ textAlign: "center", width: "100%" }}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
export default CreateEvent;
