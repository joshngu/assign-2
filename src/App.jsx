import { useMemo, useState } from "react";

const initialServices = [
  {
    id: 1,
    name: "Passport Renewal",
    description: "Processing of renewal applications.",
    duration: 25,
    priority: "high",
  },
  {
    id: 2,
    name: "Driver License Support",
    description: "License issue reporting and updates.",
    duration: 15,
    priority: "medium",
  },
  {
    id: 3,
    name: "General Inquiry",
    description: "Questions and non-transaction support.",
    duration: 10,
    priority: "low",
  },
];

const initialQueues = {
  1: ["Alicia", "Marco", "Dina", "Ben"],
  2: ["Sarah", "Tyson"],
  3: ["Mina", "Raj", "Felix"],
};

const blankForm = {
  name: "",
  description: "",
  duration: "",
  priority: "medium",
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [services, setServices] = useState(initialServices);
  const [queues, setQueues] = useState(initialQueues);

  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(1);

  const [formData, setFormData] = useState(blankForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formError, setFormError] = useState("");

  const totalQueuedUsers = useMemo(
    () => Object.values(queues).reduce((sum, queue) => sum + queue.length, 0),
    [queues]
  );

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Service name is required.";
    }
    if (formData.name.trim().length > 100) {
      return "Service name must not exceed 100 characters.";
    }
    if (!formData.description.trim()) {
      return "Description is required.";
    }
    if (!formData.duration || Number(formData.duration) <= 0) {
      return "Expected duration must be greater than 0.";
    }
    return "";
  }

  function handleSaveService(event) {
    event.preventDefault();
    const error = validateForm();
    setFormError(error);
    if (error) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration: Number(formData.duration),
      priority: formData.priority,
    };

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingServiceId ? { ...service, ...payload } : service
        )
      );
    } else {
      const nextId = services.length
        ? Math.max(...services.map((service) => service.id)) + 1
        : 1;
      setServices((prev) => [...prev, { id: nextId, ...payload }]);
      setQueues((prev) => ({ ...prev, [nextId]: [] }));
    }

    setEditingServiceId(null);
    setFormData(blankForm);
    setFormError("");
  }

  function handleEditService(service) {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      duration: String(service.duration),
      priority: service.priority,
    });
    setActiveScreen("service-management");
  }

  function handleCancelEdit() {
    setEditingServiceId(null);
    setFormData(blankForm);
    setFormError("");
  }

  function moveUser(serviceId, fromIndex, toIndex) {
    if (toIndex < 0) return;

    setQueues((prev) => {
      const queue = [...(prev[serviceId] || [])];
      if (toIndex >= queue.length) return prev;

      const [user] = queue.splice(fromIndex, 1);
      queue.splice(toIndex, 0, user);

      return { ...prev, [serviceId]: queue };
    });
  }

  function removeUser(serviceId, index) {
    setQueues((prev) => {
      const queue = [...(prev[serviceId] || [])];
      queue.splice(index, 1);
      return { ...prev, [serviceId]: queue };
    });
  }

  function serveNextUser(serviceId) {
    setQueues((prev) => {
      const queue = [...(prev[serviceId] || [])];
      queue.shift();
      return { ...prev, [serviceId]: queue };
    });
  }

  const selectedQueue = queues[selectedServiceId] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Administrator Screens</h1>
        <button
          className={activeScreen === "dashboard" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveScreen("dashboard")}
        >
          Admin Dashboard
        </button>
        <button
          className={
            activeScreen === "service-management" ? "nav-btn active" : "nav-btn"
          }
          onClick={() => setActiveScreen("service-management")}
        >
          Service Management
        </button>
        <button
          className={
            activeScreen === "queue-management" ? "nav-btn active" : "nav-btn"
          }
          onClick={() => setActiveScreen("queue-management")}
        >
          Queue Management
        </button>
      </aside>

      <main className="content">
        {activeScreen === "dashboard" && (
          <section>
            <h2>Admin Dashboard</h2>
            <div className="card-grid">
              <article className="card">
                <h3>List of Services</h3>
                <ul className="simple-list">
                  {services.map((service) => (
                    <li key={service.id}>{service.name}</li>
                  ))}
                </ul>
              </article>

              <article className="card">
                <h3>Current Queue Lengths</h3>
                <ul className="simple-list">
                  {services.map((service) => (
                    <li key={service.id}>
                      {service.name}: {queues[service.id]?.length || 0}
                    </li>
                  ))}
                </ul>
                <p className="total">Total waiting users: {totalQueuedUsers}</p>
              </article>

              <article className="card">
                <h3>Quick Actions</h3>
                <p>Queue status: {isQueueOpen ? "Open" : "Closed"}</p>
                <div className="inline-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => setIsQueueOpen(true)}
                  >
                    Open Queue
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setIsQueueOpen(false)}
                  >
                    Close Queue
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeScreen === "service-management" && (
          <section>
            <h2>Service Management Screen</h2>
            <form className="card form-layout" onSubmit={handleSaveService}>
              <h3>{editingServiceId ? "Edit Service" : "Create Service"}</h3>

              <label>
                Service Name (required, max 100)
                <input
                  name="name"
                  maxLength={100}
                  value={formData.name}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label>
                Description (required)
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label>
                Expected Duration in Minutes (required)
                <input
                  type="number"
                  min={1}
                  name="duration"
                  value={formData.duration}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label>
                Priority Level
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFieldChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              {formError && <p className="error">{formError}</p>}

              <div className="inline-actions">
                <button className="btn btn-primary" type="submit">
                  {editingServiceId ? "Save Changes" : "Create Service"}
                </button>
                {editingServiceId && (
                  <button
                    className="btn"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <article className="card">
              <h3>Existing Services</h3>
              <ul className="service-list">
                {services.map((service) => (
                  <li key={service.id}>
                    <div>
                      <strong>{service.name}</strong>
                      <p>{service.description}</p>
                      <small>
                        Duration: {service.duration} mins | Priority:{" "}
                        {service.priority}
                      </small>
                    </div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => handleEditService(service)}
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {activeScreen === "queue-management" && (
          <section>
            <h2>Queue Management Screen</h2>
            <article className="card">
              <label>
                Select Service
                <select
                  value={selectedServiceId}
                  onChange={(event) => setSelectedServiceId(Number(event.target.value))}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="inline-actions top-margin">
                <button
                  className="btn btn-primary"
                  onClick={() => serveNextUser(selectedServiceId)}
                  disabled={selectedQueue.length === 0}
                >
                  Serve Next User (Simulation)
                </button>
              </div>

              {selectedQueue.length === 0 ? (
                <p className="top-margin">No users currently in this queue.</p>
              ) : (
                <ul className="queue-list top-margin">
                  {selectedQueue.map((user, index) => (
                    <li key={`${user}-${index}`}>
                      <span>
                        #{index + 1} {user}
                      </span>
                      <div className="inline-actions">
                        <button
                          className="btn"
                          onClick={() => moveUser(selectedServiceId, index, index - 1)}
                          disabled={index === 0}
                        >
                          Up
                        </button>
                        <button
                          className="btn"
                          onClick={() => moveUser(selectedServiceId, index, index + 1)}
                          disabled={index === selectedQueue.length - 1}
                        >
                          Down
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeUser(selectedServiceId, index)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
