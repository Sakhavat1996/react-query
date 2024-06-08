import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../utils/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [deleted, setDeleted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["eventsId", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: deletePending,
    error: deleteError,
    isError: deleteIsError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        // refetchType: "none",
      });
      navigate("/events");
    },
  });
  const startDeleteItem = () => {
    setDeleted(true);
  };

  const cancelDeleteItem = () => {
    setDeleted(false);
  };

  const deleteItem = () => {
    mutate({ id });
  };

  let content = "Data not found..";
  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error?.info.message || "Failed to fetch"}
      />
    );
  }

  if (data) {
    const { title, description, image, date, location, time } = data;

    content = (
      <article id="event-details">
        <header>
          <h1>{title}</h1>
          <nav>
            <button onClick={startDeleteItem}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img
            src={`http://localhost:3000/${image}`}
            alt={`http://localhost:3000/${image}`}
          />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {date}
                && {time}
              </time>
            </div>
            <p id="event-details-description">{description}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      {deleted && (
        <Modal onclose={cancelDeleteItem}>
          <h1>Are you sure to delete?</h1>
          <p>This data could be vital.Please dont hurry up.</p>
          <div className="form-actions">
            {deletePending ? (
              <p>Item deleting ... , please wait</p>
            ) : (
              <>
                <button onClick={cancelDeleteItem} className="button-text">
                  Cancel
                </button>
                <button onClick={deleteItem} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {deleteError && (
            <ErrorBlock
              title={"Failed to delete"}
              message={error?.info.message || "Failed to delete"}
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
