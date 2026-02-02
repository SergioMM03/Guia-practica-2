import { useState, useEffect } from "react"
import { Footer } from "./components/Footer"
import { Guitar } from "./components/Guitar"
import { Header } from "./components/Header"
import { db } from "./data/db"



export const App = () => {

function initialCart() {
  const localStorageCart = localStorage.getItem('cart')
  return localStorageCart ? JSON.parse(localStorageCart) : [];
}

const [data, setData] = useState(db)
const [cart, setCart] = useState(initialCart)
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
},[cart])

function addToCart(guitar) {
  const itemIndex = cart.findIndex((item) => guitar.id === item.id);
  console.log(itemIndex);
  if (itemIndex === -1) { //Ese articulo aun no existe en el carrito
    guitar.quantity = 1;
    setCart([...cart, guitar]);
  } else { //si la guitarra ya se habia aniadido al carrito
    const updatedCart = [...cart]; // Creando una copia de la variable de estado
    updatedCart[itemIndex].quantity++;
    setCart(updatedCart);
  }
}

function calculateTotal() {
  /*let total = 0;
  for (const guitar of cart) {
    total += guitar.price * guitar.quantity;
  }*/
 let total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  return total;
}

function decreaseQuantity(id) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (item.quantity > 1) {
    setCart(
      cart.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  } else {
    setCart(cart.filter((i) => i.id !== id));
  }
}

function increaseQuantity(id) {
  const updatedCart = cart.map((item) =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  );
  setCart(updatedCart);
}

function removeFromCart(id) {
  setCart(cart.filter((item) => item.id !== id));
}

function clearCart() {
  setCart([]);
}

  return (
    <>
        <Header
          cart={cart}
          total={calculateTotal()}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
        <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">

          {data.map(guitar => (
            <Guitar guitar={guitar} key={guitar.id} addToCart={addToCart}/>
          ))}
        </div>
        </main>
        <Footer/>
    </>
  )
}
