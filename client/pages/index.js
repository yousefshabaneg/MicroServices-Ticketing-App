import Link from "next/link";

const statusColor = {
  available: "#28a745",
  reserved: "#ffc107",
};

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Tickets</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Price (USD)</th>
            <th style={styles.th}>Status:</th>
            <th style={styles.th}>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} style={styles.tr}>
              <td style={styles.td}>{ticket.title}</td>
              <td style={styles.td}>${ticket.price}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor:
                      statusColor[ticket.orderId ? "reserved" : "available"] ||
                      "#666",
                  }}
                >
                  {ticket.orderId ? "reserved" : "available"}
                </span>
              </td>
              <td style={styles.td}>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                  <span style={styles.viewButton}>View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
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
  viewButton: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#0070f3",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "none",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "13px",
    textTransform: "capitalize",
  },
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
