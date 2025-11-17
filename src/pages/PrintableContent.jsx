// 👇 This must be a forwardRef
import React from "react";
import QRCode from "react-qr-code";

const PrintableContent = React.forwardRef(({ selectedLocations }, ref) => {
  return (
    <div ref={ref}>
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
  );
});

export default PrintableContent;
