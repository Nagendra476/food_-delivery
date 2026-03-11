import React, { useEffect, useState } from "react";
import Changeaddress from "./Changeaddress";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Backcomp from "./Backcomp";
import axios from "axios";

export default function Paymentpage() {
  const [address, setAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("phonepe");
  const [loading, setLoading] = useState(false);
  const [showChangePage, setShowChangePage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("selectedAddress");

    if (stored) {
      setAddress(JSON.parse(stored));
      return;
    }

    const token = localStorage.getItem("token");

    fetch(
      "https://fooddevbackend-production.up.railway.app/api/get_addresses/",
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const defaultAddress = data.find((a) => a.is_default) || data[0];
        setAddress(defaultAddress);
      });
  }, []);

  const handleContinue = () => {
    if (!address) {
      alert("⚠ Please add delivery address before payment.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");

    axios
      .post(
        "https://fooddevbackend-production.up.railway.app/api/Order/",
        { payment_method: selectedPayment },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate("/view");
        }, 3000);
      })
      .catch((err) => {
        alert("Payment failed! Order not placed.");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeAddress = () => {
    setShowChangePage(true);
  };

  const cancelpayment = () => {
    alert("Cancelling Payment");
    navigate("/view");
  };

  const handleSelectAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setShowChangePage(false);
  };

  if (showChangePage) {
    return <Changeaddress onSelectAddress={handleSelectAddress} />;
  }

  const paymentMethods = [
    { id: "phonepe", name: "PhonePe", color: "bg-purple-50" },
    { id: "gpay", name: "Google Pay", color: "bg-blue-50" },
    { id: "paytm", name: "Paytm", color: "bg-cyan-50" },
    { id: "upi", name: "Any UPI App", color: "bg-green-50" },
  ];

  return (
    <>
      <Navbar />

      <div className="absolute top-20 left-4 z-50">
        <Backcomp />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex justify-center p-4">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl border border-gray-200">

          {/* ADDRESS */}
          <div className="p-4 border-b">
            {address ? (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  Delivering to {address.full_name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {address.house_no}, {address.street}, {address.phone_number},{" "}
                  {address.city}, {address.state}, {address.pincode}
                </p>

                <button
                  onClick={handleChangeAddress}
                  className="text-indigo-600 text-sm mt-2 hover:underline"
                >
                  Change delivery address
                </button>
              </>
            ) : (
              <>
                <p className="text-red-500">⚠ Please add delivery address</p>

                <button
                  onClick={handleChangeAddress}
                  className="text-indigo-600 text-sm mt-2 hover:underline"
                >
                  Add Address
                </button>
              </>
            )}
          </div>

          {/* PAYMENT METHODS */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">
              Select Payment Method
            </h3>

            <div className="space-y-3">

              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${
                    selectedPayment === method.id
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200"
                  } ${method.color}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />

                    <span className="font-medium text-gray-700">
                      {method.name}
                    </span>
                  </div>

                  <span className="text-sm text-gray-500">UPI</span>
                </label>
              ))}
            </div>
          </div>

          {/* CONTINUE */}
          <div className="p-4 space-y-3">
            <button
              disabled={!address}
              onClick={handleContinue}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                address
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Pay & Place Order"}
            </button>

            <button
              onClick={cancelpayment}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white px-8 py-6 rounded-xl shadow-lg text-2xl font-semibold text-center">
            🎉 Order Placed Successfully! 🎉
          </div>
        </div>
      )}
    </>
  );
}