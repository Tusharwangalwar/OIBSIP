
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./PizzaBuilder.css";

const API_URL = "http://localhost:5000";

function PizzaBuilder() {
  const [ingredients, setIngredients] = useState({
    bases: [],
    sauces: [],
    cheese: [],
    vegetables: [],
  });

  const [base, setBase] = useState("");
  const [sauce, setSauce] = useState("");
  const [cheese, setCheese] = useState("");
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function loadIngredients() {
      try {
        const response = await axios.get(`${API_URL}/api/ingredients`);
        const data = response.data;

        setIngredients({
          bases: data.bases || [],
          sauces: data.sauces || [],
          cheese: data.cheese || [],
          vegetables: data.vegetables || [],
        });
      } catch {
        setError("Unable to load ingredients. Please check your backend.");
      } finally {
        setLoading(false);
      }
    }

    loadIngredients();
  }, []);

  const total = useMemo(() => {
    const all = [
      ...ingredients.bases,
      ...ingredients.sauces,
      ...ingredients.cheese,
      ...ingredients.vegetables,
    ];

    const selectedIds = [base, sauce, cheese, ...vegetables].filter(Boolean);

    return selectedIds.reduce((sum, id) => {
      const item = all.find((ingredient) => ingredient._id === id);
      return sum + (item ? Number(item.price) || 0 : 0);
    }, 0);
  }, [ingredients, base, sauce, cheese, vegetables]);

  function toggleVegetable(id) {
    setVegetables((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }
  
function addToCart() {
  if (!base || !sauce || !cheese) {
    setCartMessage("Please select a base, sauce, and cheese.");
    return;
  }

  const allIngredients = [
    ...ingredients.bases,
    ...ingredients.sauces,
    ...ingredients.cheese,
    ...ingredients.vegetables,
  ];

  const selectedIds = [base, sauce, cheese, ...vegetables];

  const selectedItems = selectedIds
    .map((id) => allIngredients.find((item) => item._id === id))
    .filter(Boolean);

  const cartItem = {
    id: crypto.randomUUID(),
    name: "Custom Pizza",
    ingredients: selectedItems.map((item) => ({
      id: item._id,
      name: item.name,
      price: Number(item.price) || 0,
    })),
    total,
    quantity: 1,
  };

  try {
    const existingCart = JSON.parse(
      localStorage.getItem("pizzaCart") || "[]"
    );

    if (!Array.isArray(existingCart)) {
      throw new Error("Invalid cart data");
    }

    existingCart.push(cartItem);
    localStorage.setItem("pizzaCart", JSON.stringify(existingCart));

    setCartMessage("Custom pizza added to your cart!");
  } catch {
    setCartMessage("Unable to save your cart. Please try again.");
  }
}


  function renderOptions(items, selected, onSelect, multiple = false) {
    if (!items.length) {
      return <p className="builder-muted">No options available.</p>;
    }

    return (
      <div className="builder-options">
        {items.map((item) => {
          const isSelected = multiple
            ? selected.includes(item._id)
            : selected === item._id;

          return (
            <button
              type="button"
              key={item._id}
              className={`builder-option ${isSelected ? "selected" : ""}`}
              aria-pressed={isSelected}
              disabled={item.available === false}
              onClick={() =>
                multiple
                  ? onSelect(item._id)
                  : onSelect(item._id)
              }
            >
              <span>{item.name}</span>
              <strong>₹{Number(item.price) || 0}</strong>
              {isSelected && <span aria-hidden="true"> ✓</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (loading) {
    return <main className="pizza-builder"><p>Loading ingredients...</p></main>;
  }

  if (error) {
    return <main className="pizza-builder"><p role="alert">{error}</p></main>;
  }

  return (
    <main className="pizza-builder">
      <header className="builder-header">
        <p className="builder-eyebrow">YOUR PIZZA, YOUR WAY</p>
        <h1>Build Your Pizza 🍕</h1>
        <p>Choose your favorite ingredients and create your perfect pizza.</p>
      </header>

      <section className="builder-section">
        <h2>1. Choose your base</h2>
        {renderOptions(ingredients.bases, base, setBase)}
      </section>

      <section className="builder-section">
        <h2>2. Choose your sauce</h2>
        {renderOptions(ingredients.sauces, sauce, setSauce)}
      </section>

      <section className="builder-section">
        <h2>3. Choose your cheese</h2>
        {renderOptions(ingredients.cheese, cheese, setCheese)}
      </section>

      <section className="builder-section">
        <h2>4. Add vegetables</h2>
        <p className="builder-muted">Select as many as you like.</p>
        {renderOptions(
          ingredients.vegetables,
          vegetables,
          toggleVegetable,
          true
        )}
      </section>

      <aside className="builder-summary">
        <div>
          <p className="builder-muted">Your custom pizza</p>
          <h2>Order summary</h2>
          <p>
            {[
              base && ingredients.bases.find((item) => item._id === base)?.name,
              sauce && ingredients.sauces.find((item) => item._id === sauce)?.name,
              cheese && ingredients.cheese.find((item) => item._id === cheese)?.name,
              ...vegetables.map(
                (id) => ingredients.vegetables.find((item) => item._id === id)?.name
              ),
            ].filter(Boolean).join(", ") || "Choose ingredients to get started"}
          </p>
        </div>
        <div className="builder-total">
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>
        <button type="button" onClick={addToCart}>
          Add to cart
        </button>
        {cartMessage && <p role="status">{cartMessage}</p>}
        <button
          type="button"
          className="builder-reset"
          onClick={() => {
            setBase("");
            setSauce("");
            setCheese("");
            setVegetables([]);
          }}
        >
          Clear selections
        </button>
         <button
        type="button"
        className="builder-add-cart"
        onClick={addToCart}
      >
        Add to Cart — ₹{total}
      </button>

      {cartMessage && (
        <p role="status" aria-live="polite">
          {cartMessage}
        </p>
      )}
      </aside>
    </main>
  );
}

export default PizzaBuilder;
