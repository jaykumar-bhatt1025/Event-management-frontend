import React, { useState, useEffect } from "react";
import { getEvents, deleteEvent, Event } from "../requests/api";

interface EventListProps {
  onEdit: (event: Event) => void;
  onCreate: () => void;
  refreshEvents: boolean;
}

const EventList: React.FC<EventListProps> = ({
  onEdit,
  onCreate,
  refreshEvents,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { events, total } = await getEvents({
        page,
        limit,
        sortBy,
        order,
        filterName,
        filterStartDate,
        filterEndDate,
      });
      setEvents(events);
      setTotalEvents(total);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sortBy, order, refreshEvents]);

  const handleSort = (field: "title" | "startDate" | "endDate") => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field: "title" | "startDate" | "endDate") => {
    if (sortBy === field) {
      return order === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-primary" onClick={onCreate}>
          Add Event
        </button>
      </div>
      <div className="d-flex gap-2 py-4">
        <input
          type="text"
          placeholder="Search by name"
          className="form-control"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
        />
        <button onClick={fetchData} className="btn btn-secondary">
          Filter
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer" }}
                >
                  Title {getSortIcon("title")}
                </th>
                <th>Description</th>
                <th
                  onClick={() => handleSort("startDate")}
                  style={{ cursor: "pointer" }}
                >
                  Start Date {getSortIcon("startDate")}
                </th>
                <th
                  onClick={() => handleSort("endDate")}
                  style={{ cursor: "pointer" }}
                >
                  End Date {getSortIcon("endDate")}
                </th>
                <th>Total Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{event.startDate}</td>
                  <td>{event.endDate}</td>
                  <td>{event.totalGuests}</td>
                  <td>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => onEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <div>
              Page {page} of {Math.ceil(totalEvents / limit)}
            </div>
            <div>
              <button
                className="btn btn-secondary me-2"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                disabled={page >= Math.ceil(totalEvents / limit)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventList;
