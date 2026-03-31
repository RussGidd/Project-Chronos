import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    getConnection();

    async function getConnection() {
      try {
        const response = await fetch(`${API_BASE}/connect`);
        if (!response.ok) {
          throw new Error("Unable to reach the server.");
        }

        const json = await response.json();
        setMessage(json.message);
      } catch (error) {
        setMessage(error.message);
      }
    }
  }, [API_BASE]);
  return (
    <>
      <h1>{message}</h1>
    </>
  );
}

export default App;
