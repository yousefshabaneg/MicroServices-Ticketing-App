// pages/orders/[orderId].js or wherever you had OrderShow
import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import CheckoutForm from "../../components/CheckoutForm";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Time left to pay: {timeLeft} seconds
      </h2>
      <CheckoutForm
        orderId={order.id}
        onSuccess={() => Router.push("/orders")}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
