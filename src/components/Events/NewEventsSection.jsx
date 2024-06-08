import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../utils/http.js";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events" , {max: 3} ],
    queryFn: ({signal , queryKey}) => fetchEvents({signal , ...queryKey[1]})
    // staleTime: 200,
    // gcTime: 50
  });

  let content = null;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info || error.message || "Failed to fetch"}
      />
    );
  }

  if (data?.length) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Son elave olunanlar</h2>
      </header>
      {content || 'Data yoxdur'}
    </section>
  );
}
