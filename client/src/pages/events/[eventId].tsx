import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/common/constants";
import { IEvent } from "@/common/interfaces_zod";
import {
  List,
  Card,
  Pagination,
  message,
  Typography,
  Select,
  Button,
  Tag,
} from "antd";
import { AuthContext } from "@/contexts/AuthContext";
import { IAuthTokenDecoded, ITag } from "../../common/interfaces";
import { FilterOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs"; //for formatting the times

const { Title, Paragraph } = Typography;
const { Option } = Select;

const EventDetails = () => {
  //get event_id from router
  const router = useRouter();
  const { eventId } = router.query;
  //debugging
  console.log("event id", eventId);
  //state variables for event information and loading state
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authState } = useContext(AuthContext);
  //this function fetches the event information from the backend API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        });
        //this handles response errors
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        //this parses the response JSON and updates the event state
        const eventData = await response.json();
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        //this logs and handles fetch errors
        console.error("Error fetching event", error);
        setLoading(false);
      }
    };
    //DEBUGGING
    console.log("eventId: ", eventId);
    //this fetches event data when the event_id changes
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  //DEBUGGING
  console.log("event: ", event);
  //renders a loading message while fetching event data
  if (loading) {
    console.log("loading event page");
    return <div>Loading...</div>;
  }
  //this renders an error message if event data is not found
  if (!event) {
    return <div>Event not found</div>;
  }
  //finally render the event details once the event has loaded
  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        {"Event "}
        {event.event_id}
      </Typography.Title>
      <Card
        title={`Event ID: ${event.event_id}`}
        style={{
          backgroundColor: "white",
          borderRadius: "0.625rem",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {event.createdById == authState?.decodedToken?.id && (
          <div
            style={{
              position: "absolute",
              top: "18px",
              right: "20px",
              zIndex: 1,
            }}
          >
            <Tag
              color="#66BB6A"
              style={{
                borderRadius: "0.625rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "1px 6px",
                fontSize: "12px",
              }}
            >
              <UserOutlined style={{ marginRight: "4px", fontSize: "12px" }} />
              My Event
            </Tag>
          </div>
        )}
        <Paragraph
          style={{
            color: "#66BB6A",
            fontSize: "12px",
            marginBottom: "6px",
          }}
        >
          Post Time: {dayjs(event.post_time).format("YYYY-MM-DD HH:mm")} <br />
          Expire Time: {dayjs(event.exp_time).format("YYYY-MM-DD HH:mm")}
        </Paragraph>
        <Paragraph style={{ color: "black", lineHeight: "3" }}>
          {/*Created by: {event.createdById} <br />*/}
          Description: {event.description} <br />
          Quantity: {event.qty} <br />
          Tags:{" "}
          {event.tags?.length !== 0
            ? event.tags?.map((tag) => tag.name).join(", ")
            : "Not Specified"}{" "}
          <br />
          {/* Tags:{" "}
          {event.tags && event.tags.length > 0
            ? event.tags.map((tag, index) => (
                <span key={(tag as ITag).tag_id}>
                  {(tag as ITag).name}
                  {index !== event.tags.length - 1 && ", "}
                </span>
              ))
            : " Not specified"} */}
          {/* <br /> */}
          Location:{" "}
          {event.location
            ? `${event.location.Address}, Floor ${event.location.floor}, Room ${event.location.room}`
            : "Not specified"}
        </Paragraph>
      </Card>
    </div>
  );
};

export default EventDetails;
