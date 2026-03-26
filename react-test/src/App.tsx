import { useEffect, useState } from "react";
import usersData from "./users.json";

type User = {
  id: number;
  name: string;
  age: number;
  role: string;
};

function useUsers() {
  // incorrect empty state condition(1)
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  // incorrect useEffect(2)
  useEffect(() => {
    async function load() {
      const res = usersData;
      setUsers(res);
    }
    load();
  }, []);
  // search function misuse(3)
  const filtered = users.filter((u: User) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );
  // missing return data(4)
  return { users, setUsers, filtered, setSearch };
}

export default function App() {
  const { filtered, setSearch, setUsers } = useUsers();
  const [newSearch, setNewSearch] = useState("");
  const [form, setForm] = useState({ name: "", age: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // prevent default missing(5)
    e.preventDefault();
    // incorrect data logic(6)
    const newUser: User = {
      id: Date.now(),
      name: form.name,
      age: Number(form.age),
      role: "user",
    };
    // fixed direct mutation(7)
    if (!newUser.name || !newUser.age) {
      alert("Fields cannot be empty");
      return;
    }
    setUsers((currentUsers) => [...currentUsers, newUser]);
    setForm({ name: "", age: "" });
  };
  // fixed any type(8)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    // Fixed handle Change(9)
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };
  function handleSearch() {
    setSearch(newSearch);
  }
  return (
    <div>
      <h1>Users</h1>
      <label>Search:</label>
      <input onChange={(e) => setNewSearch(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Age:</label>
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          style={{ marginTop: "5px" }}
        />
        <button>Add</button>
      </form>
      {/*possibly undefibed(10)*/}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {filtered &&
          filtered.map((u: User) => (
            <div
              key={u.id}
              style={{
                border: "1px solid black",
                width: "130px",
                marginTop: "2px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Incorrect key setup */}
              <p>Name: {u.name}</p>
              <p>Age: {u.age}</p>
              <p>Role: {u.role?.toUpperCase()}</p>
            </div>
          ))}
      </div>

      {/* Can be null(11) */}
      {filtered.length === 0 && <p>No users</p>}
    </div>
  );
}
