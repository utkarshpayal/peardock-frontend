// @ts-nocheck
import React, { useState, useEffect } from "react";

function ContainerManagement() {
  const [containerId, setContainerId] = useState("");
  const [containerName, setContainerName] = useState("");
  const [containerImage, setContainerImage] = useState("ubuntu");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const storedContainerId = localStorage.getItem("containerId");
    if (storedContainerId) {
      setContainerId(storedContainerId);
      setStatusMessage(`Container <b>${storedContainerId}</b> is running.`);
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
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div
      className="container-management"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "24px",
        backgroundColor: "#f6f8fa",
        color: "#24292e",
        height: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
    >
      <h1 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: "600" }}>Container Management</h1>
      
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

          <a
            href="/containerTerminal"
            style={{
              textDecoration: "none",
              backgroundColor: containerId ? "#0366d6" : "#f5f5f5",
              color: containerId ? "white" : "#959da5",
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
            Go to Container Operations
          </a>
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

      {/* How to Use Section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px" }}>How to Use</h2>
        <ol style={{ padding: "0 0 0 20px", margin: 0 }}>
          <li style={{ marginBottom: "8px" }}>Enter a name for your container.</li>
          <li style={{ marginBottom: "8px" }}>Select an image from the dropdown.</li>
          <li style={{ marginBottom: "8px" }}>Click "Start Container" to create and start the container.</li>
          <li style={{ marginBottom: "8px" }}>Once the container is running, click "Go to Container Operations" to manage your container.</li>
        </ol>
      </div>
    </div>
  );
}

export default ContainerManagement;