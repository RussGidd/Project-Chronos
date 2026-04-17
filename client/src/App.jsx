import "./App.css";
import { useState } from "react";
// import { useEffect } from "react";

function App() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [hoursToday, setHoursToday] = useState(null);

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
      setHoursToday(null);
      setMessage(json.message);
      setPin("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleBeginShift() {
    setMessage("Starting shift...");
    setHoursToday(null);

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

  async function handleEndShift() {
    setMessage("Ending shift...");
    setHoursToday(null);

    try {
      const response = await fetch(`${API_BASE}/api/shifts/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to end shift.");
      }

      setMessage(json.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleViewHours() {
    setMessage("Loading hours...");

    try {
      const response = await fetch(`${API_BASE}/api/employees/me/hours/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to load hours.");
      }

      setHoursToday(json);
      setMessage("Hours loaded.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleLogout() {
    setToken("");
    setEmployee(null);
    setEmployeeNumber("");
    setPin("");
    setHoursToday(null);
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

      <button type="button" onClick={handleEndShift}>
        End Shift
      </button>

      <button type="button" onClick={handleViewHours}>
        View Hours
      </button>

      <button type="button" onClick={handleLogout}>
        Log Out
      </button>

      <p>{message}</p>

      {hoursToday && (
        <section>
          <h3>Today&apos;s Hours</h3>
          <p>Total Hours: {hoursToday.totalHoursToday}</p>

          {hoursToday.shifts.length === 0 ? (
            <p>No shifts found for today.</p>
          ) : (
            <ul>
              {hoursToday.shifts.map(function (shift) {
                return (
                  <li key={shift.id}>
                    Shift #{shift.id}: {shift.status}, {shift.runningHours}{" "}
                    hours, {shift.timePunches.length} punches
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
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
