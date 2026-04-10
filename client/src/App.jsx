import "./App.css";
import { useState } from "react";
// import { useEffect } from "react";

function App() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
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
        throw new Error(json.error || "Unable to log in.");
      }

      setToken(json.token);
      setEmployee(json.employee);
      setMessage(json.message);
      setPin("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleBeginShift() {
    setMessage("Starting shift...");

    try {
      const response = await fetch(`${API_BASE}/api/shifts/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to start shift.");
      }

      setMessage(json.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleLogout() {
    setToken("");
    setEmployee(null);
    setEmployeeNumber("");
    setPin("");
    setMessage("Logged out.");
  }

  if (!token || !employee) {
    return (
      <main>
        <h1>Project Chronos</h1>
        <h2>Employee Login</h2>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Log In</button>
        </form>

        <p>{message}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Project Chronos</h1>
      <h2>Welcome, {employee.firstName}</h2>

      <button type="button" onClick={handleBeginShift}>
        Begin Shift
      </button>

      <button type="button" onClick={handleLogout}>
        Log Out
      </button>

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
