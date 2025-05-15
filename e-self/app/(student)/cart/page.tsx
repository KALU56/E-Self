"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  const handlePayment = (type: "half" | "full") => {
    if (type === "half") {
      router.push("/payment/half");
    } else {
      router.push("/payment/full");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 pl-42">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-[#8E1616]">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Left Side: Cart Items (Takes 3/4 of space) */}
          <div className="lg:col-span-3 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-[#8E1616] text-white px-4 py-2 rounded hover:bg-[#D84040] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D84040]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Right Side: Order Summary (Takes 1/4 of space) */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md h-fit w-full max-w-md justify-self-end">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p className="text-lg font-medium">Total: ${totalPrice.toFixed(2)}</p>
            <div className="mt-6 flex flex-col gap-4">
              
              <button 
                onClick={() => handlePayment("half")}
                className="bg-[#8E1616] text-white px-5 py-2 rounded hover:bg-[#D84040] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D84040]"
              >
                Half Payment
              </button>
              <button 
                onClick={() => handlePayment("full")}
                className="bg-[#8E1616] text-white px-5 py-2 rounded hover:bg-[#D84040] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D84040]"
              >
                Full Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
