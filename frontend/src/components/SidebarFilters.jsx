import { useEffect, useState, useRef } from "react";
import { fetchFilters } from "../api/recordsApi";

/* ---- Custom Dropdown Component ---- */
function Dropdown({ label, name, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="dropdown-container mb-3">
      <button
        className="dropdown-label"
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        <svg className={`dropdown-arrow ${open ? "rotate" : ""}`} width="16" height="16" fill="currentColor">
          <path d="M4.5 6l3.5 4 3.5-4" />
        </svg>
      </button>

      <div className={`dropdown-list ${open ? "open" : ""}`}>
        <div
          className={`dropdown-option ${value === "" ? "active" : ""}`}
          onClick={() => { onSelect(name, ""); setOpen(false); }}
        >
          All
        </div>

        {options.map((o) => (
          <div
            key={o}
            className={`dropdown-option ${value === o ? "active" : ""}`}
            onClick={() => { onSelect(name, o); setOpen(false); }}
          >
            {o}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SidebarFilters({ onFilterChange, onClose }) {

  const [filters, setFilters] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    country: [],
    pestle: [],
    source: []
  });

  const [selected, setSelected] = useState({
    search: "",
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    country: "",
    pestle: "",
    source: ""
  });

  useEffect(() => {
    fetchFilters().then(f => {
      setFilters({
        end_year: f.end_year || [],
        topic: f.topic || [],
        sector: f.sector || [],
        region: f.region || [],
        country: f.country || [],
        pestle: f.pestle || [],
        source: f.source || []
      });
    });
  }, []);

  const changeTextValue = (e) => {
    const updated = { ...selected, [e.target.name]: e.target.value };
    setSelected(updated);
    onFilterChange(updated);
    if (onClose) onClose();
  };

  const selectDropdown = (name, value) => {
    const updated = { ...selected, [name]: value };
    setSelected(updated);
    onFilterChange(updated);
    if (onClose) onClose();
  };

  const reset = () => {
    const empty = {
      search: "",
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      country: "",
      pestle: "",
      source: ""
    };
    setSelected(empty);
    onFilterChange(empty);
    if (onClose) onClose();
  };

  return (
    <div className="sidebar p-4 rounded-2xl">
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-600 dark:text-gray-300 cursor-pointer">✕</button>
        )}
      </div>

      {/* Search */}
      <div className="mb-3">
        <label>Search</label>
        <input
          name="search"
          value={selected.search}
          onChange={changeTextValue}
          className="input w-full mt-1 px-3 py-2 rounded-xl"
          placeholder="Search"
        />
      </div>

      {/* Custom Dropdowns */}
      <Dropdown label="End Year" name="end_year" value={selected.end_year} options={filters.end_year} onSelect={selectDropdown} />
      <Dropdown label="Topic" name="topic" value={selected.topic} options={filters.topic} onSelect={selectDropdown} />
      <Dropdown label="Sector" name="sector" value={selected.sector} options={filters.sector} onSelect={selectDropdown} />
      <Dropdown label="Region" name="region" value={selected.region} options={filters.region} onSelect={selectDropdown} />
      <Dropdown label="Country" name="country" value={selected.country} options={filters.country} onSelect={selectDropdown} />
      <Dropdown label="PESTLE" name="pestle" value={selected.pestle} options={filters.pestle} onSelect={selectDropdown} />
      <Dropdown label="Source" name="source" value={selected.source} options={filters.source} onSelect={selectDropdown} />

      <button onClick={reset} className="w-full text-red-500 mt-4 cursor-pointer">Reset</button>
    </div>
  );
}
