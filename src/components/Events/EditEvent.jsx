import {
  Link,
  redirect,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import {useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../utils/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {


  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useNavigation();
  const { id } = useParams();
  const { data, isError } = useQuery({
    queryKey: ["eventsId", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    staleTime : 10000
  });

  // const {mutate , isPending: mutPending} = useMutation({
  //   mutationFn: updateEvent,
  //   // onSuccess: ()=>{
  //   //   queryClient.invalidateQueries({
  //   //     queryKey: ["eventsId", id]
  //   //   })
  //   //   navigate('../')
  //   // },
  //   onMutate : async ({event: formData})=>{
  //     await queryClient.cancelQueries({queryKey: ["eventsId", id]});

  //     const oldData =  queryClient.getQueryData(["eventsId", id]  ,formData)
  //     queryClient.setQueryData(["eventsId", id]  ,formData);
  //     navigate('../');
  //     return { oldData }
  //   },
  //   onError: (error , data , context)=>{
  //     queryClient.setQueryData(["eventsId", id]  , context.oldData)
  //   },
  //   onSettled : ()=>{
  //     queryClient.invalidateQueries(["eventsId", id])
  //   }
  // })

  let content;
  function handleSubmit(formData) {
    submit(formData, { method: "PUT" });
  }

  function handleClose() {
    navigate("../");
  }

  // if (isPending) {
  //   content = <LoadingIndicator />;
  // }

  // if (isError) {
  //   content = (
  //     <>
  //       <ErrorBlock
  //         title="Failed to fetch"
  //         message={error?.info.message || "Failed to Fetch"}
  //       />
  //       <div className="form-actions">
  //         <Link to={"../"} className="button">
  //           Okay
  //         </Link>
  //       </div>
  //     </>
  //   );
  // }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Data is sending...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  return  <Modal onClose={handleClose}>{content}</Modal>
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["eventsId", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params  }) {
  console.log(request , params)
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(["events"]);
  return redirect("../");
}