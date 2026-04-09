import "./App.css";
// import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

  async function handleBeginShift(event) {
    event.preventDefault();

    setMessage("Starting shift...");

    try {
      const response = await fetch(`${API_BASE}/api/shifts/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeNumber: Number(employeeNumber),
          pin,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to start shift.");
      }

      setMessage(json.message);
      setEmployeeNumber("");
      setPin("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main>
      <h1>Project Chronos</h1>
      <h2>Begin Shift</h2>

      <form onSubmit={handleBeginShift}>
        <div>
          <label htmlFor="employeeNumber">Employee Number</label>
          <input
            id="employeeNumber"
            type="number"
            value={employeeNumber}
            onChange={function (event) {
              setEmployeeNumber(event.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            value={pin}
            onChange={function (event) {
              setPin(event.target.value);
            }}
          />
        </div>

        <button type="submit">Begin Shift</button>
      </form>

      <p>{message}</p>
    </main>
  );
}
//   useEffect(() => {
//     getConnection();

//     async function getConnection() {
//       try {
//         const response = await fetch(`${API_BASE}/connect`);
//         if (!response.ok) {
//           throw new Error("Unable to reach the server.");
//         }

//         const json = await response.json();
//         setMessage(json.message);
//       } catch (error) {
//         setMessage(error.message);
//       }
//     }
//   }, [API_BASE]);
//   return (
//     <>
//       <h1>{message}</h1>
//     </>
//   );
// }

export default App;
