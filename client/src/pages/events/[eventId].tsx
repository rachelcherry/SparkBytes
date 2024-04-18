import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/common/constants";
import { IEvent } from "@/common/interfaces_zod";
import { Card, Typography } from "antd";
import { AuthContext } from "@/contexts/AuthContext";

const { Title, Paragraph } = Typography;

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
    <div>
      <Title level={2}>{event.event_id}</Title>
      <Card>
        <Paragraph>Description: {event.description}</Paragraph>
      </Card>
    </div>
  );
};

export default EventDetails;
