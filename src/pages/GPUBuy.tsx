import React, { useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

const AddGpuForm = () => {
  const [host, setHost] = useState("");
  const [gpu, setGpu] = useState("");
  const [vcpu, setVcpu] = useState("");
  const [ram, setRam] = useState("");
  const [network, setNetwork] = useState("");
  const [storage, setStorage] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (
      !host ||
      !gpu ||
      !vcpu ||
      !ram ||
      !network ||
      !storage ||
      !price ||
      !time ||
      !key
    ) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8282/add-gpus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host,
          gpu,
          vcpu,
          ram,
          network,
          storage,
          price,
          time,
          key,
        }),
      });

      if (response.status === 201) {
        setMessage("GPU added successfully!");
        setHost("");
        setGpu("");
        setVcpu("");
        setRam("");
        setNetwork("");
        setStorage("");
        setPrice("");
        setTime("");
        setKey("");
      }
    } catch (error) {
      setMessage("Error adding GPU: " + error.message);
    }

    setLoading(false);
  };

  const inputFields = [
    {
      label: "Host Machine",
      value: host,
      setter: setHost,
      placeholder: "Enter host machine name",
    },
    {
      label: "GPU Model",
      value: gpu,
      setter: setGpu,
      placeholder: "Enter GPU model",
    },
    {
      label: "vCPU Cores",
      value: vcpu,
      setter: setVcpu,
      placeholder: "Enter vCPU count",
    },
    {
      label: "RAM (GB)",
      value: ram,
      setter: setRam,
      placeholder: "Enter RAM size",
    },
    {
      label: "Network (Mbps)",
      value: network,
      setter: setNetwork,
      placeholder: "Enter network speed",
    },
    {
      label: "Storage (GB)",
      value: storage,
      setter: setStorage,
      placeholder: "Enter storage size",
    },
    {
      label: "Price (INR)",
      value: price,
      setter: setPrice,
      type: "number",
      placeholder: "Enter price",
    },
    {
      label: "Duration (Hours)",
      value: time,
      setter: setTime,
      type: "number",
      placeholder: "Enter duration",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Add New GPU</h2>
            <p className="mt-2 text-gray-600">
              Fill in the details to add a new GPU to the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {inputFields.map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                64-bit Key (Hex)
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter 64-bit hexadecimal key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-4 ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {message.includes("success") ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {message}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                "Add GPU"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGpuForm;
