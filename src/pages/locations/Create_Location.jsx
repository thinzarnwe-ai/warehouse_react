import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateLocation() {
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState(null);

  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);

  const [bays, setBays] = useState([]);
  const [bay, setBay] = useState(null);

  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(null);

  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/location", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        setZones(json.data.zones || []);
        setRows(json.data.rows || []);
        setBays(json.data.bays || []);
        setLevels(json.data.levels || []);
        setBranches(json.data.branches || []);
      } catch (err) {
        console.error("Failed to load location data:", err);
      }
    };

    fetchLocationData();
  }, []);

  const formatOptions = (arr) => arr.map(item => ({ value: item.id, label: item.name }));

  const formattedBranches = useMemo(() => formatOptions(branches), [branches]);
  const formattedZones = useMemo(() => formatOptions(zones), [zones]);
  const formattedRows = useMemo(() => formatOptions(rows), [rows]);
  const formattedBays = useMemo(() => formatOptions(bays), [bays]);
  const formattedLevels = useMemo(() => formatOptions(levels), [levels]);

  const clearForm = () => {
    setBranch(null);
    setZone(null);
    setRow(null);
    setBay(null);
    setLevel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branch || !zone || !row || !bay || !level) {
      toast.error("Please fill in all fields.");
      return;
    }

    const payload = {
      branch_id: branch,
      zone_id: zone,
      row_id: row,
      bay_id: bay,
      level_id: level,
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        clearForm();
        toast.success("Location saved!");
        navigate("/locations")

      } else {
        console.error("Server error:", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Request error:", error);
      toast.error("An error occurred while saving location.");
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ label, options, value, onChange, inputId }) => (
    <div className="sm:col-span-3">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="mt-2">
        <Select
          inputId={inputId}
          options={options}
          value={options.find(opt => opt.value === value) || null}
          onChange={(selected) => onChange(selected?.value || null)}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="md:bg-gray-200 md:p-[20px]">
      <div className="space-y-12 pb-0 md:w-[75%] md:m-auto border-1 border-[#107a8b] shadow rounded-3xl bg-[#107a8b]">
        <div className="md:h-15 h-10 flex items-center justify-center rounded">
          <h2 className="text-2xl font-bold text-white mt-10">Location Form</h2>
        </div>

        <div className="border-b border-gray-900/10 pb-12 bg-white w-full p-10 rounded-t-4xl">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <SelectField
              label="Branch"
              inputId="branch"
              options={formattedBranches}
              value={branch}
              onChange={setBranch}
            />
            <SelectField
              label="Zone"
              inputId="zone"
              options={formattedZones}
              value={zone}
              onChange={setZone}
            />
            <SelectField
              label="Row"
              inputId="row"
              options={formattedRows}
              value={row}
              onChange={setRow}
            />
            <SelectField
              label="Bay"
              inputId="bay"
              options={formattedBays}
              value={bay}
              onChange={setBay}
            />
            <SelectField
              label="Level"
              inputId="level"
              options={formattedLevels}
              value={level}
              onChange={setLevel}
            />

            <div className="flex items-center justify-end gap-x-6 w-full">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}