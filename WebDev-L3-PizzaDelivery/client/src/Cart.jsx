
import { useEffect, useState } from "react";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("pizzaCart") || "[]"
      );

      setCartItems(Array.isArray(savedCart) ? savedCart : []);
    } catch (error) {
      console.error("Unable to read cart:", error);
      setCartItems([]);
    }
  }

  function saveCart(updatedItems) {
    localStorage.setItem("pizzaCart", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
    window.dispatchEvent(new Event("pizzaCartUpdated"));
  }

  function changeQuantity(id, amount) {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              Number(item.quantity || 1) + amount
            ),
          }
        : item
    );

    saveCart(updatedItems);
  }

  function removeItem(id) {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    saveCart(updatedItems);
  }

  const grandTotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.total || 0) * Number(item.quantity || 1),
    0
  );

  return (
    <section className="cart-page">
      <h1>Your Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Go back and add your favorite custom pizza.</p>
          <button type="button" onClick={loadCart}>
            Refresh Cart
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h2>{item.name || "Custom Pizza"}</h2>

                  <p>
                    {Array.isArray(item.ingredients)
                      ? item.ingredients
                          .map((ingredient) => ingredient.name)
                          .join(", ")
                      : "Custom ingredients"}
                  </p>

                  <p>
                    Price per pizza: ₹
                    {Number(item.total || 0).toFixed(2)}
                  </p>
                </div>

                <div className="cart-actions">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, -1)}
                      disabled={Number(item.quantity || 1) <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-total">
            <h2>Grand Total: ₹{grandTotal.toFixed(2)}</h2>

            <button
              type="button"
              className="checkout-button"
              onClick={() =>
                alert("Checkout will be implemented next!")
              }
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
