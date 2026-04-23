import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    date: "",
    contactInfo: ""
  });

  const [editId, setEditId] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const API = process.env.REACT_APP_API;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const getItems = async () => {
    const res = await axios.get(`${API}/api/items`);
    setItems(res.data);
  };

  useEffect(() => {
    if (!token) navigate("/");
    getItems();
  }, []);

  const saveItem = async () => {
    if (editId) {
      await axios.put(`${API}/api/items/${editId}`, form, {
        headers: { Authorization: token }
      });
      setEditId(null);
    } else {
      await axios.post(`${API}/api/items`, form, {
        headers: { Authorization: token }
      });
    }

    setForm({
      itemName: "",
      description: "",
      type: "Lost",
      location: "",
      date: "",
      contactInfo: ""
    });

    getItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`${API}/api/items/${id}`, {
      headers: { Authorization: token }
    });
    getItems();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter ? item.type === typeFilter : true) &&
    (dateFilter ? item.date === dateFilter : true)
  );

  return (
    <div className="page-dashboard">
      <div className="container dashboard">
        <h2>Dashboard</h2>

        {/* FORM */}
        <input
          placeholder="Item Name"
          value={form.itemName}
          onChange={e => setForm({ ...form, itemName: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Contact"
          value={form.contactInfo}
          onChange={e => setForm({ ...form, contactInfo: e.target.value })}
        />

        {/* BUTTONS */}
        <div className="btn-group">
          <button onClick={saveItem}>
            {editId ? "Update Item" : "Add Item"}
          </button>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

        <h3>All Items</h3>

        <div className="table-container">
          {/* FILTERS */}
          <div className="table-controls">
            <input
              placeholder="Search by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>

                  <td className={item.type === "Lost" ? "lost" : "found"}>
                    {item.type}
                  </td>

                  <td>{item.location}</td>
                  <td>{item.date}</td>
                  <td>{item.contactInfo}</td>

                  <td>
                    {item.userId === userId && (
                      <>
                        <button onClick={() => {
                          setForm(item);
                          setEditId(item._id);
                        }}>
                          Edit
                        </button>

                        <button
                          style={{ background: "#e53e3e", marginLeft: "5px" }}
                          onClick={() => deleteItem(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;