// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

function CustomTerminal() {
  const [containerId, setContainerId] = useState("");
  const [containerName, setContainerName] = useState("");
  const [containerImage, setContainerImage] = useState("ubuntu");
  const [statusMessage, setStatusMessage] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [containerStatus, setContainerStatus] = useState(null);
  const [terminals, setTerminals] = useState({});
  const [sockets, setSockets] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [termCounter, setTermCounter] = useState(1);
  const [availableIds, setAvailableIds] = useState([]);
  const terminalContainerRef = useRef(null);

  useEffect(() => {
    const storedContainerId = localStorage.getItem("containerId");
    if (storedContainerId) {
      setContainerId(storedContainerId);
      setStatusMessage(`Container <b>${storedContainerId}</b> is running.`);
      // Initialize terminals if needed
    }
  }, []);

  const startContainer = async () => {
    if (!containerName) {
      alert("Please enter a valid container name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/containers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: containerName, image: containerImage }),
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setContainerId(data.id);
      localStorage.setItem("containerId", data.id);
      setStatusMessage(
        `Container <b>${containerName}</b> started! ID: <b>${data.id}</b>`
      );
      // Connect to terminal
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  const removeContainer = async () => {
    if (!containerId) {
      alert("No active container to remove.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/containers/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: containerId }),
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setStatusMessage(
        `Container <b>${containerId}</b> has been stopped and removed.`
      );
      setContainerId("");
      localStorage.removeItem("containerId");

      // Close sockets
      Object.values(sockets).forEach((socket) => {
        if (socket) socket.close();
      });
      setSockets({});
    } catch (error) {
      setStatusMessage(`Error removing container: ${error.message}`);
    }
  };

  const addTerminal = () => {
    let termId;
    if (availableIds.length) {
      termId = availableIds[0];
      setAvailableIds((prevIds) => prevIds.slice(1));
    } else {
      termId = `term-${termCounter}`;
      setTermCounter((prev) => prev + 1);
    }

    if (terminals[termId]) {
      switchTerminal(termId);
      return;
    }

    // Create terminal element
    const termElement = document.createElement("div");
    termElement.id = termId;
    termElement.style.display = "none";
    termElement.className = "xterm w-full";
    terminalContainerRef.current.appendChild(termElement);

    // Initialize Terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      width: 100,
      theme: {
        background: "#1e1e1e",
        foreground: "#f0f0f0",
        cursor: "#f0f0f0",
        selection: "rgba(255, 255, 255, 0.3)",
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termElement);
    fitAddon.fit();

    // Setup WebSocket
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => term.write("Connected!\r\n");
    socket.onmessage = (event) => term.write(event.data);
    term.onData((data) => socket.send(data));

    // Update state
    setTerminals((prev) => ({ ...prev, [termId]: term }));
    setSockets((prev) => ({ ...prev, [termId]: socket }));
    switchTerminal(termId);
  };

  const switchTerminal = (termId) => {
    Object.keys(terminals).forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.style.display = "none";
    });

    const element = document.getElementById(termId);
    if (element) element.style.display = "block";
    setActiveTab(termId);
  };

  const closeTerminal = (termId, e) => {
    e.stopPropagation();

    // Close socket
    if (sockets[termId]) {
      sockets[termId].close();
      setSockets((prev) => {
        const newSockets = { ...prev };
        delete newSockets[termId];
        return newSockets;
      });
    }

    // Dispose terminal
    if (terminals[termId]) {
      terminals[termId].dispose();
      setTerminals((prev) => {
        const newTerminals = { ...prev };
        delete newTerminals[termId];
        return newTerminals;
      });
    }

    // Remove DOM element
    const element = document.getElementById(termId);
    if (element) element.remove();

    // Update available IDs
    setAvailableIds((prev) => [...prev, termId]);

    // Switch to another tab if needed
    if (activeTab === termId) {
      const remainingTabs = Object.keys(terminals).filter(
        (id) => id !== termId
      );
      if (remainingTabs.length) {
        switchTerminal(remainingTabs[0]);
      } else {
        setActiveTab(null);
      }
    }
  };

  const fetchContainerStatus = async () => {
    if (!containerId) {
      alert("No container is currently running.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/status?id=${containerId}`
      );
      const data = await response.json();
      setContainerStatus(data);
      setShowStatusModal(true);
    } catch (error) {
      setContainerStatus({ error: "Error fetching status." });
      setShowStatusModal(true);
    }
  };

  return (
    <div
      className="App"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f6f8fa",
        margin: 0,
        color: "#24292e",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "24px",
          maxHeight: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        {/* Control Panel */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                minWidth: "200px",
              }}
            >
              <label
                htmlFor="containerName"
                style={{
                  fontWeight: "500",
                  marginBottom: "6px",
                  fontSize: "14px",
                }}
              >
                Container Name
              </label>
              <input
                id="containerName"
                type="text"
                placeholder="Enter container name"
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid rgb(180, 179, 179)",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  fontSize: "14px",
                  color: "black",
                  outline: "none",
                  transition: "border-color 0.2s",
                  ":focus": {
                    borderColor: "black",
                  },
                }}
                required
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                minWidth: "200px",
              }}
            >
              <label
                htmlFor="containerImage"
                style={{
                  fontWeight: "500",
                  marginBottom: "6px",
                  fontSize: "14px",
                }}
              >
                Image
              </label>
              <select
                id="containerImage"
                value={containerImage}
                onChange={(e) => setContainerImage(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  color: "black",
                  backgroundColor: "white",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23595959' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: "32px",
                  appearance: "none",
                }}
              >
                <option value="ubuntu">Ubuntu</option>
                <option value="debian">Debian</option>
                <option value="alpine">Alpine</option>
                <option value="centos">CentOS</option>
                <option value="node">Node.js</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={startContainer}
              style={{
                backgroundColor: "#2ea44f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 16px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#2c974b")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2ea44f")
              }
            >
              <svg
                style={{ marginRight: "8px" }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Start Container
            </button>

            <button
              onClick={removeContainer}
              disabled={!containerId}
              style={{
                backgroundColor: containerId ? "#e83b46" : "#f5f5f5",
                color: containerId ? "white" : "#959da5",
                border: "none",
                borderRadius: "4px",
                padding: "10px 16px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: containerId ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                containerId &&
                (e.currentTarget.style.backgroundColor = "#d42e3a")
              }
              onMouseOut={(e) =>
                containerId &&
                (e.currentTarget.style.backgroundColor = "#e83b46")
              }
            >
              <svg
                style={{ marginRight: "8px" }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Remove Container
            </button>

            <button
              onClick={fetchContainerStatus}
              disabled={!containerId}
              style={{
                backgroundColor: containerId ? "#0366d6" : "#f5f5f5",
                color: containerId ? "white" : "#959da5",
                border: "none",
                borderRadius: "4px",
                padding: "10px 16px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: containerId ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                containerId &&
                (e.currentTarget.style.backgroundColor = "#0359c4")
              }
              onMouseOut={(e) =>
                containerId &&
                (e.currentTarget.style.backgroundColor = "#0366d6")
              }
            >
              <svg
                style={{ marginRight: "8px" }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Container Status
            </button>
          </div>

          {statusMessage && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f1f8ff",
                borderLeft: "4px solid #0366d6",
                borderRadius: "4px",
                marginTop: "8px",
                fontSize: "14px",
              }}
              dangerouslySetInnerHTML={{ __html: statusMessage }}
            />
          )}
        </div>

        {/* Terminal Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 16px",
              borderBottom: "1px solid #e1e4e8",
              backgroundColor: "#f6f8fa",
            }}
          >
            <button
              onClick={addTerminal}
              disabled={!containerId}
              style={{
                backgroundColor: "#0366d6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 12px",
                fontWeight: "500",
                fontSize: "14px",
                cursor: containerId ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                marginRight: "12px",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0359c4")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0366d6")
              }
            >
              <svg
                style={{ marginRight: "8px" }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              New Terminal
            </button>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                whiteSpace: "nowrap",
                paddingBottom: "4px",
              }}
            >
              {Object.keys(terminals).map((termId) => (
                <div
                  key={termId}
                  onClick={() => switchTerminal(termId)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    marginRight: "4px",
                    backgroundColor:
                      activeTab === termId ? "#0366d6" : "#f0f2f5",
                    color: activeTab === termId ? "white" : "#24292e",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: activeTab === termId ? "500" : "normal",
                    transition: "background-color 0.2s",
                  }}
                >
                  <span>Terminal {termId.split("-")[1]}</span>
                  <span
                    onClick={(e) => closeTerminal(termId, e)}
                    style={{
                      marginLeft: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor:
                        activeTab === termId
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.1)",
                      fontSize: "10px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        activeTab === termId
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        activeTab === termId
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={terminalContainerRef}
            style={{
              flexGrow: 1,
              backgroundColor: "#1e1e1e",
              padding: "4px 0",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          />
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "1200px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e1e4e8",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#24292e",
                }}
              >
                Container Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  display: "flex",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              {containerStatus && !containerStatus.error ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#f1f8ff",
                      padding: "12px 16px",
                      borderRadius: "6px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor:
                          containerStatus.status === "running"
                            ? "#2ea44f"
                            : "#e83b46",
                        marginRight: "12px",
                      }}
                    ></div>
                    <span style={{ fontWeight: "500" }}>
                      {containerStatus.status === "running"
                        ? "Running"
                        : containerStatus.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        Name
                      </h4>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {containerStatus.name}
                      </p>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        ID
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontFamily: "monospace",
                        }}
                      >
                        {containerStatus.id}
                      </p>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        Image
                      </h4>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {containerStatus.image}
                      </p>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        IP Address
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontFamily: "monospace",
                        }}
                      >
                        {containerStatus.ip}
                      </p>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        Memory Usage
                      </h4>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {containerStatus.memory}
                      </p>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        CPU Usage
                      </h4>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {containerStatus.cpu}
                      </p>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#586069",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600",
                        }}
                      >
                        Created
                      </h4>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {containerStatus.created
                          ? new Date(containerStatus.created).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#e83b46",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>
                    {containerStatus?.error ||
                      "Error fetching container status"}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #e1e4e8",
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  backgroundColor: "#f6f8fa",
                  border: "1px solid #d1d5da",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  color: "red",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ebeef1")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f6f8fa")
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTerminal;
