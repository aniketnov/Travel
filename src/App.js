import { useState, useEffect } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: true },
// ];

export default function App() {
  const [items, setItems] = useState(function () {
    const itemvalues = localStorage.getItem("items");
    return JSON.parse(itemvalues);
  });

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handledeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Header />
      <Form onAddItem={handleAddItems} />
      <PakingList
        items={items}
        ondltItem={handledeleteItem}
        onToggleItem={handleToggleItem}
        onclearAll={handleClearList}
      />
      <Footer items={items} />
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1>
        <span>🌴</span> Far Away <span>✈</span>
      </h1>
    </header>
  );
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = {
      quantity,
      description,
      packed: false,
      id: Date.now().toFixed(4),
    };
    // console.log(newItem);
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Items..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PakingList({ items, ondltItem, onToggleItem, onclearAll }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <ListItems
            item={item}
            key={item.id}
            ondltItem={ondltItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      <div className="action">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onclearAll}>Clear All</button>
      </div>
    </div>
  );
}

function ListItems({ item, ondltItem, onToggleItem }) {
  return (
    <li>
      <span>
        <input
          type="checkbox"
          value={item.packed}
          onChange={() => onToggleItem(item.id)}
        />
      </span>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button className="button" onClick={() => ondltItem(item.id)}>
        ❌
      </button>
    </li>
  );
}

function Footer({ items }) {
  const Numitems = items.length;
  const packedItem = items.filter((items) => items.packed).length;
  const packedPercentage = Math.round((packedItem / Numitems) * 100);

  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );

  return (
    <footer className="stats">
      <em>
        {packedPercentage === 100
          ? "You got everything! Ready to go ✈️"
          : ` 💼 You have ${Numitems} items on your list, and you already packed ${packedItem} (${packedPercentage}%)`}
      </em>
    </footer>
  );
}
