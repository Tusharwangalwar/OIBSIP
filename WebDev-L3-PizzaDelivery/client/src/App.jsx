import PizzaBuilder from "./PizzaBuilder";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000";

function readCartCount() {
  try {
    const items = JSON.parse(
      localStorage.getItem("pizzaCart") || "[]"
    );

    return Array.isArray(items)
      ? items.reduce(
          (sum, item) => sum + Number(item.quantity || 1),
          0
        )
      : 0;
  } catch {
    return 0;
  }
}

function App() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(readCartCount);

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const response = await axios.get(`${API_URL}/api/pizzas`);
        setPizzas(response.data.pizzas || []);
      } catch {
        setError(
          "Unable to load pizzas. Please check that your backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPizzas();
  }, []);

  function updateCartCount() {
    setCartCount(readCartCount());
  }

  // Step 4: Update cart count when cart data changes.
  useEffect(() => {
    function handleCartUpdate() {
      setCartCount(readCartCount());
    }

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("pizzaCartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener(
        "pizzaCartUpdated",
        handleCartUpdate
      );
    };
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={() => setShowCart(false)}
        >
          🍕 PizzaCraft
        </a>

        <span className="nav-label">
          Freshly made, your way
        </span>

        <button
          type="button"
          className="customize-button"
          onClick={() => {
            updateCartCount();
            setShowCart(true);
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      {showCart ? (
        <main>
          <button
            type="button"
            className="customize-button"
            onClick={() => {
              updateCartCount();
              setShowCart(false);
            }}
            style={{ margin: "20px" }}
          >
            ← Back to Home
          </button>

          <Cart />
        </main>
      ) : (
        <>
          <main id="home">
            <section className="hero">
              <p className="eyebrow">YOUR PIZZA, YOUR RULES</p>

              <h1>
                Good pizza.
                <br />
                Great choices.
              </h1>

              <p>
                Discover your favourites and get ready to build a pizza
                that's uniquely yours.
              </p>

              <a className="hero-button" href="#menu">
                Explore the menu ↓
              </a>
            </section>

            <section className="menu" id="menu">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MADE FOR YOU</p>
                  <h2>Explore our pizzas</h2>
                </div>

                <span className="menu-count">
                  {pizzas.length} pizzas
                </span>
              </div>

              {loading && (
                <p className="message">
                  Loading delicious pizzas...
                </p>
              )}

              {error && (
                <p className="message error">{error}</p>
              )}

              {!loading && !error && pizzas.length === 0 && (
                <p className="message">
                  No pizzas are available right now.
                </p>
              )}

              <div className="pizza-grid">
                {pizzas.map((pizza) => (
                  <article className="pizza-card" key={pizza._id}>
                    <div className="pizza-image">🍕</div>

                    <div className="pizza-info">
                      <h3>{pizza.name}</h3>
                      <p>{pizza.description}</p>

                      <div className="pizza-bottom">
                        <strong>₹{pizza.basePrice}</strong>

                        <button
                          type="button"
                          className="customize-button"
                          onClick={() =>
                            document
                              .getElementById("builder")
                              ?.scrollIntoView({
                                behavior: "smooth",
                              })
                          }
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="builder-placeholder"
              id="builder"
            >
              <p className="eyebrow">MAKE IT YOURS</p>
              <h2>Your perfect pizza starts here.</h2>
              <p>
                Choose your base, sauce, cheese, and favourite vegetables.
              </p>
            </section>

            <PizzaBuilder />
          </main>

          <footer>
            PizzaCraft · Made with love and extra cheese 🧀
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
