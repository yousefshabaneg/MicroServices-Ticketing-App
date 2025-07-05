import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.id, orderId }),
    });

    if (response.ok) {
      onSuccess();
    } else {
      const resBody = await response.json();
      setError(resBody.errors?.[0]?.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Payment</h3>

      <div style={styles.card}>
        <CardElement options={cardStyle} />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          ...styles.button,
          backgroundColor: loading ? "#ccc" : "#0070f3",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

// Styles
const styles = {
  form: {
    width: "100%",
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    transition: "background 0.3s",
  },
  error: {
    marginBottom: "10px",
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
};

// Stripe input styling
const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default CheckoutForm;
