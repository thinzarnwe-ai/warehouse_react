import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

export default function Location_List() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
   const componentRef = useRef(null);
  const handleSelect = (location) => {
    setSelectedLocations((prev) =>
      prev.some((l) => l.id === location.id)
        ? prev.filter((l) => l.id !== location.id)
        : [...prev, location]
    );
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Selected_Locations",
    removeAfterPrint: true,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchLocationData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        ...(fromDate && toDate ? { from_date: fromDate, to_date: toDate } : {}),
      });
      const res = await fetch(`/api/locations?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setLocations(json.data.data);
      setPagination({
        current_page: json.data.current_page,
        total: json.data.total,
        per_page: json.data.per_page,
      });
    } catch (err) {
      console.error("Failed to load location data:", err);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const handlePageChange = (newPage) => {
    fetchLocationData(newPage);
  };

  return (
    <>
      <div className="flex justify-between items-center me-2 md:me-5 shadow pe-1">
        <div className="p-4 md:flex gap-15">
          {/* <div className="w-full">
            <label htmlFor="" className=" font-medium block ">
              From Date
            </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm border w-full px-8 focus:outline-none"
          />
          </div> */}
          <div className="w-full">
            <label htmlFor="" className=" font-medium block ">
              Zone
            </label>
            <input
              type="text"
              className="0 py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm  border w-full px-8 focus:border-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="" className=" font-medium block ">
              Row
            </label>
            <input
              type="text"
              className="0 py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm  border w-full px-8 focus:border-3 focus:outline-none"
            />
          </div>
          {/* <div className="w-full">
            <label htmlFor="" className=" font-medium block ">
              To Date
            </label>
           <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm border w-full px-8 focus:outline-none"
          />
          </div> */}

          <div className="w-full">
            <button
              onClick={() => fetchLocationData(1)}
              className="mt-6 bg-primary text-white px-6 py-2 rounded"
            >
              Filter
            </button>
            {/* <div className="mt-6 me-2">
              {selectedLocations.length > 0 && (
                <div className="text-end">
                  <button
                    onClick={handlePrint}
                    className="bg-[#107a8b] text-white px-6 py-2 rounded-lg shadow hover:bg-[#0d6e7b] transition-all"
                  >
                    Print
                  </button>
                </div>
              )}
            </div> */}
          </div>
        </div>
        <Link
          to="/create_location"
          className="bg-primary py-2 px-3 text-white rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-primary ">
            <tr>
              <th scope="col" className="px-6 py-5">
                No
              </th>
              <th scope="col" className="px-6 py-5">
                Location Name
              </th>
              <th scope="col" className="px-6 py-5">
                QR Generate
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => {
              const serial =
                (pagination.current_page - 1) * pagination.per_page + index + 1;
              return (
                <tr
                  key={location.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {serial}
                  </td>
                  <td className="px-6 py-5">{location.location_name}</td>
                  <td className="px-6 py-5">
                    <QRCode value={location.location_name} size={64} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="">
        <div className="p-4 space-y-6">
      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="border p-4 rounded-xl shadow bg-white flex justify-between items-center"
          >
            <div className="space-y-2">
              <p className="font-bold">{location.location_name}</p>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="accent-[#107a8b] w-4 h-4"
                  checked={selectedLocations.some((l) => l.id === location.id)}
                  onChange={() => handleSelect(location)}
                />
                Select
              </label>
            </div>
            <QRCode value={location.location_name} size={64} />
          </div>
        ))}
      </div>

      {/* Print Button */}
      {selectedLocations.length > 0 && (
        <div className="text-end">
          <button
            onClick={handlePrint}
            className="bg-[#107a8b] text-white px-6 py-2 rounded-lg shadow hover:bg-[#0d6e7b]"
          >
            Print Selected
          </button>
        </div>
      )}

      {/* ✅ Print Component (Mounted but Hidden with CSS) */}
      <div
        ref={componentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div className="p-4 w-[800px]">
          <h2 className="text-xl font-bold mb-4 text-black">Selected Locations</h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedLocations.map((location) => (
              <div
                key={location.id}
                className="border p-4 rounded-md shadow bg-white flex justify-between items-center"
              >
                <div className="font-bold text-black">{location.location_name}</div>
                <QRCode value={location.location_name} size={64} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => handlePageChange(pagination.current_page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={
            pagination.current_page * pagination.per_page >= pagination.total
          }
          onClick={() => handlePageChange(pagination.current_page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
