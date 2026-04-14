import "./App.css";
import { useState } from "react";

const AUTH_STORAGE_KEY = "chronos-auth-session";

function readStoredSession() {
  // WHY: Restoring a valid saved session improves auth usability without changing backend behavior.
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return { token: "", employee: null };
    }

    const parsedSession = JSON.parse(rawSession);

    if (!parsedSession?.token || !parsedSession?.employee) {
      return { token: "", employee: null };
    }

    return parsedSession;
  } catch {
    return { token: "", employee: null };
  }
}

async function parseResponseJson(response) {
  // WHY: A shared response parser gives consistent auth error handling when APIs return non-JSON bodies.
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function App() {
  const savedSession = readStoredSession();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(savedSession.token);
  const [employee, setEmployee] = useState(savedSession.employee);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

  async function handleLogin(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    // WHY: Client-side input checks provide immediate feedback and avoid avoidable auth requests.
    const normalizedEmployeeNumber = employeeNumber.trim();
    const normalizedPin = pin.trim();

    if (!normalizedEmployeeNumber || !normalizedPin) {
      setMessage("Employee number and PIN are required.");
      return;
    }

    if (!/^\d+$/.test(normalizedEmployeeNumber)) {
      setMessage("Employee number must use digits only.");
      return;
    }

    setMessage("Logging in...");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeNumber: normalizedEmployeeNumber,
          pin: normalizedPin,
        }),
      });

      const json = await parseResponseJson(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to log in.");
      }

      // WHY: Persisting auth state keeps users logged in after refresh and reduces repeated login friction.
      setToken(json.token);
      setEmployee(json.employee);
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: json.token, employee: json.employee }),
      );
      setMessage(json.message);
      setPin("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBeginShift() {
    // WHY: Guarding protected actions on the client avoids unnecessary unauthorized requests.
    if (!token) {
      setMessage("Please log in before starting a shift.");
      return;
    }

    setMessage("Starting shift...");

    try {
      const response = await fetch(`${API_BASE}/api/shifts/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await parseResponseJson(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to start shift.");
      }

      setMessage(json.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleLogout() {
    // WHY: Clearing local session data ensures logout fully removes client-side auth state.
    setToken("");
    setEmployee(null);
    setEmployeeNumber("");
    setPin("");
    localStorage.removeItem(AUTH_STORAGE_KEY);
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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p aria-live="polite">{message}</p>
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

      <p aria-live="polite">{message}</p>
    </main>
  );
}

export default App;
