import "./App.css";
import { useState } from "react";

function App() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [activeLoginField, setActiveLoginField] = useState("employeeNumber");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [hoursThisWeek, setHoursThisWeek] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [newEmployeePin, setNewEmployeePin] = useState("");
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeNickname, setNewEmployeeNickname] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("employee");
  const [newEmployeeStatus, setNewEmployeeStatus] = useState("active");
  const [createEmployeeMessage, setCreateEmployeeMessage] = useState("");
  const [createEmployeeMessageType, setCreateEmployeeMessageType] =
    useState("info");
  const [historyEmployeeNumber, setHistoryEmployeeNumber] = useState("");
  const [employeeHistory, setEmployeeHistory] = useState(null);
  const [editingPunchId, setEditingPunchId] = useState(null);
  const [editPunchHour, setEditPunchHour] = useState("");
  const [editPunchMinute, setEditPunchMinute] = useState("");
  const [editPunchPeriod, setEditPunchPeriod] = useState("AM");
  const [pendingPunchEdit, setPendingPunchEdit] = useState(null);
  const [editingShiftNoteId, setEditingShiftNoteId] = useState(null);
  const [shiftNoteDraft, setShiftNoteDraft] = useState("");
  const [pendingDeleteEmployeeNumber, setPendingDeleteEmployeeNumber] =
    useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

  function formatTime(dateValue) {
    return new Date(dateValue).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getPunchTimeParts(dateValue) {
    const date = new Date(dateValue);
    let hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return {
      hour: String(hour),
      minute,
      period,
    };
  }

  function getFormattedEditTime() {
    return `${Number(editPunchHour)}:${String(editPunchMinute).padStart(
      2,
      "0",
    )} ${editPunchPeriod}`;
  }

  function canManageSelectedEmployeeHistory() {
    if (!employeeHistory) {
      return false;
    }

    return (
      employeeHistory.employee.role !== "admin" ||
      employeeHistory.employee.employee_number === employee.employeeNumber
    );
  }

  function getShiftNoteText(shift) {
    return shift.admin_note?.trim() || "";
  }

  function formatDate(dateValue) {
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
  }

  function formatWeekRange(week) {
    if (!week) {
      return "";
    }

    return `${formatDate(week.weekStart)} - ${formatDate(week.weekEnd)}`;
  }

  function formatShiftMessage(action, punchTime) {
    if (!punchTime) {
      return action;
    }

    return `${action} at ${formatTime(punchTime)}`;
  }

  function formatDisplayText(value) {
    if (!value) {
      return "";
    }

    return value
      .split("_")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  function formatPunchType(punchType) {
    const punchLabels = {
      shift_start: "Begin Shift",
      lunch_start: "Clock Out for Lunch",
      lunch_end: "Clock In from Lunch",
      shift_end: "End Shift",
    };

    return punchLabels[punchType] || formatDisplayText(punchType);
  }

  function setCreateEmployeeFeedback(type, text) {
    setCreateEmployeeMessageType(type);
    setCreateEmployeeMessage(text);
  }

  async function getApiResponseData(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const responseText = await response.text();

    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.includes("<html")) {
      return {
        error: "The app received an unexpected HTML response instead of API data.",
      };
    }

    if (!responseText) {
      return {};
    }

    return {
      error: responseText,
    };
  }

  function canDeleteEmployee(listedEmployee) {
    return (
      listedEmployee.role !== "admin" &&
      listedEmployee.employee_number !== employee.employeeNumber
    );
  }

  function canUpdateEmployeeStatus(listedEmployee) {
    return listedEmployee.role !== "admin";
  }

  async function loadEmployeeList(options = {}) {
    const {
      loadingMessage = "Loading employee list...",
      successMessage = "Employee list loaded.",
    } = options;

    if (loadingMessage) {
      setMessage(loadingMessage);
    }

    const response = await fetch(`${API_BASE}/api/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await getApiResponseData(response);

    if (!response.ok) {
      throw new Error(json.error || "Unable to load the employee list.");
    }

    setEmployees(json);

    if (successMessage) {
      setMessage(successMessage);
    }

    return json;
  }

  function handleKeypadDigit(digit) {
    if (activeLoginField === "pin") {
      setPin(function (currentPin) {
        return `${currentPin}${digit}`;
      });
      return;
    }

    setEmployeeNumber(function (currentEmployeeNumber) {
      return `${currentEmployeeNumber}${digit}`;
    });
  }

  function handleKeypadBackspace() {
    if (activeLoginField === "pin") {
      setPin(function (currentPin) {
        return currentPin.slice(0, -1);
      });
      return;
    }

    setEmployeeNumber(function (currentEmployeeNumber) {
      return currentEmployeeNumber.slice(0, -1);
    });
  }

  function handleKeypadClear() {
    if (activeLoginField === "pin") {
      setPin("");
      return;
    }

    setEmployeeNumber("");
  }

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

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to log in.");
      }

      setToken(json.token);
      setEmployee(json.employee);
      setHoursThisWeek(null);
      setEmployees([]);
      setEmployeeHistory(null);
      cancelPunchEdit();
      cancelShiftNoteEdit();
      setCreateEmployeeFeedback("info", "");
      setMessage(json.message);
      setPin("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleBeginShift() {
    setMessage("Starting shift...");
    setHoursThisWeek(null);

    try {
      const response = await fetch(`${API_BASE}/api/shifts/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to start shift.");
      }

      setMessage(
        formatShiftMessage(
          "Shift started successfully",
          json.timePunch?.punch_time,
        ),
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleEndShift() {
    setMessage("Ending shift...");
    setHoursThisWeek(null);

    try {
      const response = await fetch(`${API_BASE}/api/shifts/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to end shift.");
      }

      setMessage(
        formatShiftMessage(
          "Shift ended successfully",
          json.timePunch?.punch_time,
        ),
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleStartLunch() {
    setMessage("Clocking out for lunch...");
    setHoursThisWeek(null);

    try {
      const response = await fetch(`${API_BASE}/api/shifts/lunch/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to clock out for lunch.");
      }

      setMessage(
        formatShiftMessage(
          "Clocked out for lunch",
          json.timePunch?.punch_time,
        ),
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleEndLunch() {
    setMessage("Clocking in from lunch...");
    setHoursThisWeek(null);

    try {
      const response = await fetch(`${API_BASE}/api/shifts/lunch/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to clock in from lunch.");
      }

      setMessage(
        formatShiftMessage(
          "Clocked in from lunch",
          json.timePunch?.punch_time,
        ),
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleViewHours() {
    setMessage("Loading weekly hours...");

    try {
      const response = await fetch(`${API_BASE}/api/employees/me/hours/week`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to load hours.");
      }

      setHoursThisWeek(json);
      setMessage("Weekly hours loaded.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLoadEmployees() {
    try {
      await loadEmployeeList();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateEmployee(event) {
    event.preventDefault();

    if (!newEmployeePin || !newEmployeeFirstName || !newEmployeeLastName) {
      setCreateEmployeeFeedback(
        "error",
        "PIN, first name, and last name are required before creating an employee.",
      );
      return;
    }

    setMessage("Creating employee...");
    setCreateEmployeeFeedback("info", "Creating employee...");

    try {
      const response = await fetch(`${API_BASE}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pin: newEmployeePin,
          first_name: newEmployeeFirstName,
          nickname: newEmployeeNickname || null,
          last_name: newEmployeeLastName,
          role: newEmployeeRole,
          status: newEmployeeStatus,
        }),
      });

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to create employee.");
      }

      setNewEmployeePin("");
      setNewEmployeeFirstName("");
      setNewEmployeeNickname("");
      setNewEmployeeLastName("");
      setNewEmployeeRole("employee");
      setNewEmployeeStatus("active");

      await handleLoadEmployees();
      await handleLoadEmployeeHistory(json.employee_number);
      setCreateEmployeeFeedback(
        "success",
        `Employee created: ${json.first_name} ${json.last_name}`,
      );
      setMessage(`Employee created: ${json.first_name} ${json.last_name}`);
    } catch (error) {
      setCreateEmployeeFeedback("error", error.message);
      setMessage(error.message);
    }
  }

  async function handleLoadEmployeeHistory(eventOrEmployeeNumber, weekStart) {
    if (eventOrEmployeeNumber?.preventDefault) {
      eventOrEmployeeNumber.preventDefault();
    }

    const employeeNumberToLoad =
      typeof eventOrEmployeeNumber === "number"
        ? eventOrEmployeeNumber
        : historyEmployeeNumber;

    if (!employeeNumberToLoad) {
      setEmployeeHistory(null);
      setMessage("Please enter an employee number.");
      return;
    }

    setMessage("Loading employee weekly history...");

    try {
      const weekQuery = weekStart ? `?weekStart=${weekStart}` : "";
      const response = await fetch(
        `${API_BASE}/api/employees/${employeeNumberToLoad}/history${weekQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to load employee weekly history.");
      }

      setHistoryEmployeeNumber(String(employeeNumberToLoad));
      setEmployeeHistory(json);
      cancelPunchEdit();
      cancelShiftNoteEdit();
      setMessage("Employee weekly history loaded.");
    } catch (error) {
      setEmployeeHistory(null);
      setMessage(error.message);
    }
  }

  function startDeleteConfirmation(employeeNumber) {
    setPendingDeleteEmployeeNumber(employeeNumber);
  }

  function cancelDeleteConfirmation() {
    setPendingDeleteEmployeeNumber(null);
  }

  async function handleDeleteEmployee(listedEmployee) {
    const fullName = `${listedEmployee.first_name} ${listedEmployee.last_name}`;
    setMessage("Deleting employee...");

    try {
      const response = await fetch(
        `${API_BASE}/api/employees/${listedEmployee.employee_number}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to delete employee.");
      }

      setEmployees(function (currentEmployees) {
        return currentEmployees.filter(function (currentEmployee) {
          return (
            currentEmployee.employee_number !== listedEmployee.employee_number
          );
        });
      });

      if (
        employeeHistory?.employee.employee_number ===
        listedEmployee.employee_number
      ) {
        setHistoryEmployeeNumber("");
        setEmployeeHistory(null);
        cancelPunchEdit();
        cancelShiftNoteEdit();
      }

      setPendingDeleteEmployeeNumber(null);
      await loadEmployeeList({
        loadingMessage: null,
        successMessage: null,
      });
      setMessage(json.message || `Employee deleted: ${fullName}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateEmployeeStatus(listedEmployee, nextStatus) {
    setMessage("Updating employee status...");

    try {
      const response = await fetch(
        `${API_BASE}/api/employees/${listedEmployee.employee_number}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to update employee status.");
      }

      setEmployees(function (currentEmployees) {
        return currentEmployees.map(function (currentEmployee) {
          if (
            currentEmployee.employee_number === listedEmployee.employee_number
          ) {
            return {
              ...currentEmployee,
              status: nextStatus,
            };
          }

          return currentEmployee;
        });
      });

      if (
        employeeHistory?.employee.employee_number ===
        listedEmployee.employee_number
      ) {
        await handleLoadEmployeeHistory(listedEmployee.employee_number);
      } else {
        await loadEmployeeList({
          loadingMessage: null,
          successMessage: null,
        });
      }

      setMessage(
        json.message ||
          `${listedEmployee.first_name} ${listedEmployee.last_name} is now ${nextStatus}.`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleLogout() {
    setToken("");
    setEmployee(null);
    setEmployeeNumber("");
    setPin("");
      setHoursThisWeek(null);
      setEmployees([]);
    setNewEmployeePin("");
    setNewEmployeeFirstName("");
    setNewEmployeeNickname("");
    setNewEmployeeLastName("");
    setNewEmployeeRole("employee");
    setNewEmployeeStatus("active");
      setHistoryEmployeeNumber("");
      setEmployeeHistory(null);
      setPendingDeleteEmployeeNumber(null);
      cancelPunchEdit();
      cancelShiftNoteEdit();
      setCreateEmployeeFeedback("info", "");
      setMessage("Logged out.");
  }

  function beginPunchEdit(punch) {
    if (!canManageSelectedEmployeeHistory()) {
      return;
    }

    const punchTimeParts = getPunchTimeParts(punch.punch_time);

    setEditingPunchId(punch.id);
    setEditPunchHour(punchTimeParts.hour);
    setEditPunchMinute(punchTimeParts.minute);
    setEditPunchPeriod(punchTimeParts.period);
    setPendingPunchEdit(null);
  }

  function cancelPunchEdit() {
    setEditingPunchId(null);
    setEditPunchHour("");
    setEditPunchMinute("");
    setEditPunchPeriod("AM");
    setPendingPunchEdit(null);
  }

  function beginShiftNoteEdit(shift) {
    if (!canManageSelectedEmployeeHistory()) {
      return;
    }

    setEditingShiftNoteId(shift.id);
    setShiftNoteDraft(getShiftNoteText(shift));
  }

  function cancelShiftNoteEdit() {
    setEditingShiftNoteId(null);
    setShiftNoteDraft("");
  }

  async function submitShiftNoteEdit(shift) {
    if (!employeeHistory) {
      return;
    }

    const trimmedNote = shiftNoteDraft.trim();

    if (!trimmedNote) {
      setMessage("Enter a shift note before saving.");
      return;
    }

    setMessage("Saving shift note...");

    try {
      const response = await fetch(
        `${API_BASE}/api/employees/${employeeHistory.employee.employee_number}/shifts/${shift.id}/note`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            note: trimmedNote,
          }),
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to save shift note.");
      }

      const employeeNumberToLoad = employeeHistory.employee.employee_number;
      const weekStart = employeeHistory.week.weekStart;

      cancelShiftNoteEdit();
      await handleLoadEmployeeHistory(employeeNumberToLoad, weekStart);
      setMessage("Shift note saved successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteShiftNote(shift) {
    if (!employeeHistory) {
      return;
    }

    setMessage("Deleting shift note...");

    try {
      const response = await fetch(
        `${API_BASE}/api/employees/${employeeHistory.employee.employee_number}/shifts/${shift.id}/note`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to delete shift note.");
      }

      const employeeNumberToLoad = employeeHistory.employee.employee_number;
      const weekStart = employeeHistory.week.weekStart;

      cancelShiftNoteEdit();
      await handleLoadEmployeeHistory(employeeNumberToLoad, weekStart);
      setMessage("Shift note deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function preparePunchEdit(event, punch) {
    event.preventDefault();

    if (editPunchHour === "" || editPunchMinute === "") {
      setMessage("Enter a valid hour and minute.");
      return;
    }

    const hour = Number(editPunchHour);
    const minute = Number(editPunchMinute);

    if (
      !Number.isInteger(hour) ||
      hour < 1 ||
      hour > 12 ||
      !Number.isInteger(minute) ||
      minute < 0 ||
      minute > 59
    ) {
      setMessage("Enter a valid hour and minute.");
      return;
    }

    setPendingPunchEdit({
      punchId: punch.id,
      time: getFormattedEditTime(),
    });
  }

  async function submitPunchEdit() {
    if (!pendingPunchEdit || !employeeHistory) {
      return;
    }

    setMessage("Updating punch...");

    try {
      const response = await fetch(
        `${API_BASE}/api/employees/${employeeHistory.employee.employee_number}/punches/${pendingPunchEdit.punchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hour: Number(editPunchHour),
            minute: Number(editPunchMinute),
            period: editPunchPeriod,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          }),
        },
      );

      const json = await getApiResponseData(response);

      if (!response.ok) {
        throw new Error(json.error || "Unable to update punch.");
      }

      const employeeNumberToLoad = employeeHistory.employee.employee_number;
      const weekStart = employeeHistory.week.weekStart;

      cancelPunchEdit();
      await handleLoadEmployeeHistory(employeeNumberToLoad, weekStart);
      setMessage("Punch updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token || !employee) {
    return (
      <main className="login-screen">
        <h1>Project Chronos</h1>
        <h2>Employee Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="employeeNumber">Employee Number</label>
            <input
              id="employeeNumber"
              type="number"
              value={employeeNumber}
              onFocus={function () {
                setActiveLoginField("employeeNumber");
              }}
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
              onFocus={function () {
                setActiveLoginField("pin");
              }}
              onChange={function (event) {
                setPin(event.target.value);
              }}
            />
          </div>

          <button type="submit">Log In</button>
        </form>

        <section className="login-keypad" aria-label="Login numeric keypad">
          <p>
            Keypad entering:{" "}
            {activeLoginField === "pin" ? "PIN" : "Employee Number"}
          </p>

          <div className="keypad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (digit) {
              return (
                <button
                  key={digit}
                  type="button"
                  onClick={function () {
                    handleKeypadDigit(digit);
                  }}
                >
                  {digit}
                </button>
              );
            })}

            <button type="button" onClick={handleKeypadClear}>
              Clear
            </button>
            <button
              type="button"
              onClick={function () {
                handleKeypadDigit(0);
              }}
            >
              0
            </button>
            <button type="button" onClick={handleKeypadBackspace}>
              Back
            </button>
          </div>
        </section>

        <p>{message}</p>
      </main>
    );
  }

  if (employee.role === "admin") {
    return (
      <main>
        <h1>Project Chronos</h1>
        <h2>Admin Panel</h2>
        <p>
          Welcome, {employee.firstName} (Role:{" "}
          {formatDisplayText(employee.role)})
        </p>

        <button type="button" onClick={handleLoadEmployees}>
          Load Employee List
        </button>

        <button
          className="secondary-action"
          type="button"
          onClick={handleLogout}
        >
          Log Out
        </button>

        <p>{message}</p>

        <section>
          <h3>Employees</h3>

          {employees.length === 0 ? (
            <p>Load the employee list to view and inspect employee records.</p>
          ) : (
            <ul>
              {employees.map(function (listedEmployee) {
                return (
                  <li key={listedEmployee.employee_number}>
                    <button
                      type="button"
                      onClick={function () {
                        handleLoadEmployeeHistory(
                          listedEmployee.employee_number,
                        );
                      }}
                    >
                      #{listedEmployee.employee_number} -{" "}
                      {listedEmployee.first_name} {listedEmployee.last_name} (
                      {formatDisplayText(listedEmployee.role)},{" "}
                      {formatDisplayText(listedEmployee.status)})
                    </button>

                    <div className="employee-row-actions">
                      <button
                        type="button"
                        onClick={function () {
                          handleLoadEmployeeHistory(
                            listedEmployee.employee_number,
                          );
                        }}
                      >
                        View Weekly History
                      </button>

                      {canDeleteEmployee(listedEmployee) ? (
                        pendingDeleteEmployeeNumber ===
                        listedEmployee.employee_number ? (
                          <div className="delete-confirmation">
                            <p>
                              Delete #{listedEmployee.employee_number}{" "}
                              {listedEmployee.first_name}{" "}
                              {listedEmployee.last_name}? Related shifts and
                              punches will also be removed.
                            </p>
                            <div className="delete-confirmation-actions">
                              <button
                                className="danger-action"
                                type="button"
                                onClick={function () {
                                  handleDeleteEmployee(listedEmployee);
                                }}
                              >
                                Confirm Delete
                              </button>
                              <button
                                className="secondary-action"
                                type="button"
                                onClick={cancelDeleteConfirmation}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="danger-action"
                            type="button"
                            onClick={function () {
                              startDeleteConfirmation(
                                listedEmployee.employee_number,
                              );
                            }}
                          >
                            Delete Employee
                          </button>
                        )
                      ) : (
                        <p className="helper-text employee-lock-note">
                          {listedEmployee.employee_number ===
                          employee.employeeNumber
                            ? "Your own admin account cannot be deleted."
                            : listedEmployee.role === "admin"
                              ? "Admin accounts cannot be deleted here."
                              : ""}
                        </p>
                      )}

                      {canUpdateEmployeeStatus(listedEmployee) ? (
                        <button
                          className="secondary-action"
                          type="button"
                          onClick={function () {
                            handleUpdateEmployeeStatus(
                              listedEmployee,
                              listedEmployee.status === "active"
                                ? "inactive"
                                : "active",
                            );
                          }}
                        >
                          {listedEmployee.status === "active"
                            ? "Set Inactive"
                            : "Set Active"}
                        </button>
                      ) : (
                        <p className="helper-text employee-lock-note">
                          Admin account status cannot be changed here.
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h3>Employee Weekly History</h3>

          <form onSubmit={handleLoadEmployeeHistory}>
            <div>
              <label htmlFor="historyEmployeeNumber">Employee Number</label>
              <input
                id="historyEmployeeNumber"
                type="number"
                value={historyEmployeeNumber}
                onChange={function (event) {
                  setHistoryEmployeeNumber(event.target.value);
                }}
              />
            </div>

            <button type="submit">View Weekly History</button>
          </form>

          {!employeeHistory ? (
            <p>
              Select an employee or enter an employee number to view weekly
              history.
            </p>
          ) : (
            <div>
              <section>
                <h4>Selected Employee</h4>
                <p>
                  #{employeeHistory.employee.employee_number} -{" "}
                  {employeeHistory.employee.first_name}{" "}
                  {employeeHistory.employee.last_name}
                </p>
                {employeeHistory.employee.nickname && (
                  <p>Nickname: {employeeHistory.employee.nickname}</p>
                )}
                <p>
                  Role: {formatDisplayText(employeeHistory.employee.role)}{" "}
                  | Status: {formatDisplayText(employeeHistory.employee.status)}
                </p>
                <p>
                  Date of Hire:{" "}
                  {new Date(
                    employeeHistory.employee.date_of_hire,
                  ).toLocaleDateString()}
                </p>
              </section>

              <section>
                <h4>Weekly Hours</h4>
                <p>{formatWeekRange(employeeHistory.week)}</p>
                <p>
                  Total Weekly Hours: {employeeHistory.totalHoursThisWeek}{" "}
                  hours
                  {employeeHistory.isRunning ? " and counting" : ""}
                </p>

                {employeeHistory.dailyTotals.length === 0 ? (
                  <p>This employee has no shifts for this week.</p>
                ) : (
                  <ul>
                    {employeeHistory.dailyTotals.map(function (day) {
                      return (
                        <li key={day.date}>
                          {day.dayName}: {day.totalHours} hours
                          {day.isRunning ? " and counting" : ""}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {employeeHistory.shifts.length === 0 ? (
                <p>No punch details were found for this week.</p>
              ) : (
                <>
                  {canManageSelectedEmployeeHistory() && (
                    <p className="helper-text">
                      Click a punch time below to review and edit it. Shift
                      notes can be created underneath each shift.
                    </p>
                  )}

                  <ul>
                    {employeeHistory.shifts.map(function (shift) {
                      return (
                        <li key={shift.id}>
                          Shift #{shift.id}: {formatDisplayText(shift.status)},
                          date{" "}
                          {new Date(shift.shift_date).toLocaleDateString()}
                          {shift.timePunches.length === 0 ? (
                            <p>No punches found for this shift.</p>
                          ) : (
                            <ul>
                              {shift.timePunches.map(function (punch) {
                                return (
                                  <li key={punch.id}>
                                  {editingPunchId === punch.id ? (
                                    <form
                                      className="punch-edit-form"
                                      onSubmit={function (event) {
                                        preparePunchEdit(event, punch);
                                      }}
                                    >
                                      <span>
                                        {formatPunchType(punch.punch_type)}
                                      </span>

                                      <label>
                                        Hour
                                        <input
                                          type="number"
                                          min="1"
                                          max="12"
                                          value={editPunchHour}
                                          onChange={function (event) {
                                            setEditPunchHour(
                                              event.target.value,
                                            );
                                            setPendingPunchEdit(null);
                                          }}
                                        />
                                      </label>

                                      <label>
                                        Minute
                                        <input
                                          type="number"
                                          min="0"
                                          max="59"
                                          value={editPunchMinute}
                                          onChange={function (event) {
                                            setEditPunchMinute(
                                              event.target.value,
                                            );
                                            setPendingPunchEdit(null);
                                          }}
                                        />
                                      </label>

                                      <label>
                                        AM/PM
                                        <select
                                          value={editPunchPeriod}
                                          onChange={function (event) {
                                            setEditPunchPeriod(
                                              event.target.value,
                                            );
                                            setPendingPunchEdit(null);
                                          }}
                                        >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                        </select>
                                      </label>

                                      {pendingPunchEdit?.punchId ===
                                      punch.id ? (
                                        <>
                                          <span>
                                            Change punch time to{" "}
                                            {pendingPunchEdit.time}?
                                          </span>
                                          <button
                                            type="button"
                                            onClick={submitPunchEdit}
                                          >
                                            Confirm
                                          </button>
                                          <button
                                            type="button"
                                            onClick={cancelPunchEdit}
                                          >
                                            Keep Current Time
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button type="submit">
                                            Review Change
                                          </button>
                                          <button
                                            type="button"
                                            onClick={cancelPunchEdit}
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      )}
                                    </form>
                                  ) : (
                                    <button
                                      className="punch-row"
                                      type="button"
                                      disabled={!canManageSelectedEmployeeHistory()}
                                      onClick={function () {
                                        beginPunchEdit(punch);
                                      }}
                                    >
                                      {formatPunchType(punch.punch_type)} -{" "}
                                      {formatTime(punch.punch_time)}
                                      {punch.notes &&
                                        ` - Note: ${punch.notes}`}
                                    </button>
                                  )}
                                  </li>
                                );
                              })}
                            </ul>
                          )} 
                          <div className="shift-note-row">
                            <span>
                              Notes -{" "}
                              {getShiftNoteText(shift) ||
                                "No admin note for this shift."}
                            </span>

                            {canManageSelectedEmployeeHistory() &&
                              (editingShiftNoteId === shift.id ? (
                                <div className="shift-note-editor">
                                  <label htmlFor={`shift-note-${shift.id}`}>
                                    Shift Note
                                  </label>
                                  <textarea
                                    id={`shift-note-${shift.id}`}
                                    maxLength="120"
                                    rows="3"
                                    value={shiftNoteDraft}
                                    onChange={function (event) {
                                      setShiftNoteDraft(event.target.value);
                                    }}
                                  />
                                  <p className="helper-text shift-note-count">
                                    {shiftNoteDraft.length}/120
                                  </p>
                                  <div className="shift-note-actions">
                                    <button
                                      type="button"
                                      onClick={function () {
                                        submitShiftNoteEdit(shift);
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="secondary-action"
                                      type="button"
                                      onClick={cancelShiftNoteEdit}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="shift-note-actions">
                                  <button
                                    type="button"
                                    onClick={function () {
                                      beginShiftNoteEdit(shift);
                                    }}
                                  >
                                    {getShiftNoteText(shift) ? "Edit" : "Create"}
                                  </button>
                                  {getShiftNoteText(shift) && (
                                    <button
                                      className="secondary-action"
                                      type="button"
                                      onClick={function () {
                                        handleDeleteShiftNote(shift);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <div className="week-navigation">
                <div className="week-navigation-side">
                  {employeeHistory.week.canViewPrevious && (
                    <button
                      type="button"
                      onClick={function () {
                        handleLoadEmployeeHistory(
                          employeeHistory.employee.employee_number,
                          employeeHistory.week.previousWeekStart,
                        );
                      }}
                    >
                      Previous Week
                    </button>
                  )}
                </div>

                {employeeHistory.week.weekStart !==
                  employeeHistory.week.currentWeekStart && (
                  <button
                    type="button"
                    onClick={function () {
                      handleLoadEmployeeHistory(
                        employeeHistory.employee.employee_number,
                      );
                    }}
                  >
                    Current Week
                  </button>
                )}

                <div className="week-navigation-side">
                  {employeeHistory.week.canViewNext && (
                    <button
                      type="button"
                      onClick={function () {
                        handleLoadEmployeeHistory(
                          employeeHistory.employee.employee_number,
                          employeeHistory.week.nextWeekStart,
                        );
                      }}
                    >
                      Next Week
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="secondary-section">
          <h3>Create Employee</h3>

          {createEmployeeMessage && (
            <div className={`panel-message ${createEmployeeMessageType}`}>
              {createEmployeeMessage}
            </div>
          )}

          <form onSubmit={handleCreateEmployee}>
            <div>
              <label htmlFor="newEmployeePin">PIN</label>
              <input
                id="newEmployeePin"
                type="password"
                value={newEmployeePin}
                onChange={function (event) {
                  setNewEmployeePin(event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="newEmployeeFirstName">First Name</label>
              <input
                id="newEmployeeFirstName"
                type="text"
                value={newEmployeeFirstName}
                onChange={function (event) {
                  setNewEmployeeFirstName(event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="newEmployeeNickname">Nickname</label>
              <input
                id="newEmployeeNickname"
                type="text"
                value={newEmployeeNickname}
                onChange={function (event) {
                  setNewEmployeeNickname(event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="newEmployeeLastName">Last Name</label>
              <input
                id="newEmployeeLastName"
                type="text"
                value={newEmployeeLastName}
                onChange={function (event) {
                  setNewEmployeeLastName(event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="newEmployeeRole">Role</label>
              <select
                id="newEmployeeRole"
                value={newEmployeeRole}
                onChange={function (event) {
                  setNewEmployeeRole(event.target.value);
                }}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="newEmployeeStatus">Status</label>
              <select
                id="newEmployeeStatus"
                value={newEmployeeStatus}
                onChange={function (event) {
                  setNewEmployeeStatus(event.target.value);
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit">Create Employee</button>
          </form>
        </section>
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

      <button type="button" onClick={handleStartLunch}>
        Clock Out for Lunch
      </button>

      <button type="button" onClick={handleEndLunch}>
        Clock In from Lunch
      </button>

      <button type="button" onClick={handleEndShift}>
        End Shift
      </button>

      <button
        className="secondary-action"
        type="button"
        onClick={handleViewHours}
      >
        View Weekly Hours
      </button>

      <button
        className="secondary-action"
        type="button"
        onClick={handleLogout}
      >
        Log Out
      </button>

      <p>{message}</p>

      {hoursThisWeek && (
        <section>
          <h3>Weekly Hours</h3>
          {hoursThisWeek.week && <p>{formatWeekRange(hoursThisWeek.week)}</p>}
          <p>
            Total Weekly Hours: {hoursThisWeek.totalHoursThisWeek}
            {" hours"}
            {hoursThisWeek.isRunning ? " and counting" : ""}
          </p>

          {hoursThisWeek.dailyTotals.length === 0 ? (
            <p>No shifts found for this week.</p>
          ) : (
            <ul>
              {hoursThisWeek.dailyTotals.map(function (day) {
                return (
                  <li key={day.date}>
                    {day.dayName}: {day.totalHours} hours
                    {day.isRunning ? " and counting" : ""}
                  </li>
                );
              })}
            </ul>
          )}

          {hoursThisWeek.shifts.length > 0 && (
            <section>
              <h4>Punch Details</h4>
              <ul>
                {hoursThisWeek.shifts.map(function (shift) {
                  return (
                    <li key={shift.id}>
                      Shift #{shift.id}: {formatDisplayText(shift.status)},
                      date {new Date(shift.shift_date).toLocaleDateString()}
                      {shift.timePunches.length === 0 ? (
                        <p>No punches found for this shift.</p>
                      ) : (
                        <ul>
                          {shift.timePunches.map(function (punch) {
                            return (
                              <li key={punch.id}>
                                {formatPunchType(punch.punch_type)} -{" "}
                                {formatTime(punch.punch_time)}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
