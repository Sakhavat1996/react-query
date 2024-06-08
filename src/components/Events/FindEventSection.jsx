import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../utils/http';
import EventItem from './EventItem';
import ErrorBlock from '../UI/ErrorBlock';
import LoadingIndicator from '../UI/LoadingIndicator';

export default function FindEventSection() {
  const searchElement = useRef();
  const [search , setSearch] = useState()
  // console.log('111111')
  const {data , isLoading , isError , error} = useQuery({
    queryKey: ['events' , {search}],
    queryFn: ({ signal , queryKey }) => fetchEvents({signal , ...queryKey[1]}),
    enabled: search !== undefined
  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearch(searchElement.current.value)
  }
  console.log('2222')
      
  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    console.log(error);
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info || error.message || "Failed to fetch"}
      />
    );
  }

  if (data) {
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
