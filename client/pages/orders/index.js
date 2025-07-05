const statusColor = {
  created: "#0070f3", // blue
  complete: "#28a745", // green
  cancelled: "#dc3545", // red
};

const OrderIndex = ({ orders }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ticket</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={styles.tr}>
              <td style={styles.td}>{order.ticket.title}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: statusColor[order.status] || "#666",
                  }}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    textAlign: "left",
    fontSize: "16px",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "15px",
  },
  tr: {
    backgroundColor: "#fff",
  },
  badge: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "13px",
    textTransform: "capitalize",
  },
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
