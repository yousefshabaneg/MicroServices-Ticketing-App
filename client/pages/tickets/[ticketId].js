import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="container my-5">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="card-body text-center">
          <h2 className="card-title mb-3">{ticket.title}</h2>
          <h4 className="text-muted mb-4">Price: ${ticket.price}</h4>
          {errors}
          <button
            onClick={() => doRequest()}
            className="btn btn-primary btn-lg w-100"
          >
            Purchase Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
