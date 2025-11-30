/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import {
  fetchRecords
} from "../api/recordsApi";

import IntensityChart from "../components/charts/IntensityChart";
import LikelihoodChart from "../components/charts/LikelihoodChart";
import TopicFrequencyChart from "../components/charts/TopicFrequencyChart";
import SidebarFilters from "../components/SidebarFilters";
import RecordsTable from "../components/RecordsTable";
import DarkModeToggle from "../components/DarkModeToggle";
import ExportCSV from "../components/ExportCSV";

/* helpers (same as before) */
const avg = arr => {
  const nums = arr.filter(n => typeof n === "number" && !isNaN(n));
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
};
const aggregateIntensityByYear = (records) => {
  const map = new Map();
  for (const r of records) {
    const year = r.end_year ?? r.start_year;
    if (!year) continue;
    if (!map.has(year)) map.set(year, []);
    if (r.intensity !== null && r.intensity !== undefined && r.intensity !== "") {
      const v = Number(r.intensity);
      if (!isNaN(v)) map.get(year).push(v);
    }
  }
  return [...map.entries()].map(([year, arr]) => ({ _id: year, avgIntensity: avg(arr) })).sort((a, b) => a._id - b._id);
};
const aggregateLikelihoodByCountry = (records) => {
  const map = new Map();
  for (const r of records) {
    const country = r.country || "Unknown";
    if (country === "Unknown") continue;
    if (!map.has(country)) map.set(country, []);
    if (r.likelihood !== null && r.likelihood !== undefined && r.likelihood !== "") {
      const v = Number(r.likelihood);
      if (!isNaN(v)) map.get(country).push(v);
    }
  }
  return [...map.entries()].map(([c, arr]) => ({ _id: c, avgLikelihood: avg(arr) })).sort((a, b) => (b.avgLikelihood || 0) - (a.avgLikelihood || 0)).slice(0, 20);
};
const aggregateTopicFrequency = (records) => {
  const map = new Map();
  for (const r of records) {
    const t = (r.topic || "Unknown").toString().trim();
    if (!t || t === "Unknown") continue;
    map.set(t, (map.get(t) || 0) + 1);
  }
  return [...map.entries()].map(([t, c]) => ({ _id: t, count: c })).sort((a, b) => b.count - a.count).slice(0, 30);
};

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);


  const [intensityData, setIntensityData] = useState([]);
  const [likelihoodData, setLikelihoodData] = useState([]);
  const [topicData, setTopicData] = useState([]);

  const loadRecords = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      let recs = await fetchRecords(filters);
      recs = recs || [];
      if (filters.search && filters.search.trim() !== "") {
        const term = filters.search.toLowerCase();
        recs = recs.filter(
          r => (r.title && r.title.toLowerCase().includes(term)) || (r.topic && r.topic.toLowerCase().includes(term))
        );
      }
      setRecords(recs);
      setIntensityData(aggregateIntensityByYear(recs));
      setLikelihoodData(aggregateLikelihoodByCountry(recs));
      setTopicData(aggregateTopicFrequency(recs));
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecords({}); }, [loadRecords]);

  useEffect(() => {
    const handler = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);


  const handleFilterChange = (filters) => {
    setSelectedFilters(filters || {});
    loadRecords(filters || {});
    // close sidebar on mobile when a filter is chosen
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="bg-linear-to-r from-purple-500 to-violet-700 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header (C1) */}
        <div className="flex items-center justify-between mb-6 header-bar">
          <div className="flex items-center gap-3">
            {/* burger for mobile */}
            <button
              className="burger icon-btn bg-purple-400 dark:bg-gray-800 cursor-pointer"
              onClick={() => setSidebarOpen(s => !s)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-2xl mr-1 md:text-3xl font-extrabold text-gray-900 dark:text-gray-300">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex">
              <ExportCSV data={records} />
            </div>

            <DarkModeToggle className="sm: ml-1" />

            {/* small-screen export button */}
            <div className="md:hidden">
              <button onClick={() => { /* quick mobile export, same component could be used */ const a = document.querySelector('.export-btn'); if (a) a.click(); }} className="icon-btn bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#0f0f0e" fill="none" stroke="#0f0f0e" stroke-width="1.5" stroke-linecap="round">
                  <path d="M7.5 17.2196C7.44458 16.0292 6.62155 16 5.50505 16C3.78514 16 3.5 16.406 3.5 18V20C3.5 21.594 3.78514 22 5.50505 22C6.62154 22 7.44458 21.9708 7.5 20.7804M20.5 16L18.7229 20.6947C18.3935 21.5649 18.2288 22 17.968 22C17.7071 22 17.5424 21.5649 17.213 20.6947L15.4359 16M12.876 16H11.6951C11.2231 16 10.9872 16 10.8011 16.0761C10.1672 16.3354 10.1758 16.9448 10.1758 17.5C10.1758 18.0553 10.1672 18.6647 10.8011 18.9239C10.9872 19 11.2232 19 11.6951 19C12.167 19 12.4029 19 12.5891 19.0761C13.2229 19.3354 13.2143 19.9447 13.2143 20.5C13.2143 21.0553 13.2229 21.6647 12.5891 21.9239C12.4029 22 12.167 22 11.6951 22H10.4089" />
                  <path d="M20 13V10.6569C20 9.83935 20 9.4306 19.8478 9.06306C19.6955 8.69552 19.4065 8.40649 18.8284 7.82843L14.0919 3.09188C13.593 2.593 13.3436 2.34355 13.0345 2.19575C12.9702 2.165 12.9044 2.13772 12.8372 2.11401C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88607C5.26731 3.06508 5.06508 3.26731 4.88607 3.48933C4 4.58831 4 6.21082 4 9.45584V13M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar (desktop always visible, mobile sliding) */}
          {/* ===== REPLACED: mobile overlay + slide-in panel implementation ===== */}
          <>
            {/* overlay that dims page and closes sidebar when clicked */}
            <div
              className={`sidebar-overlay md:hidden ${sidebarOpen ? "open" : ""}`}
              onClick={() => setSidebarOpen(false)}
            />

            {/* slide-in sidebar panel (mobile) */}
            <div className={`sidebar-panel md:hidden ${sidebarOpen ? "open" : ""}`}>
              <SidebarFilters onFilterChange={handleFilterChange} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Desktop sidebar (unchanged) */}
            <div className="hidden md:block md:w-72 w-full md:mr-6">
              <div className="md:sticky md:top-6 z-40">
                <SidebarFilters onFilterChange={handleFilterChange} onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>

          {/* Main content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="text-gray-600 dark:text-gray-200">Loading data…</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="col-span-1 chart-wrap card p-0">
                    <IntensityChart data={intensityData} />
                  </div>
                  <div className="col-span-1 chart-wrap card p-0">
                    <LikelihoodChart data={likelihoodData} />
                  </div>
                  <div className="col-span-1 lg:col-span-2 chart-wrap card p-0">
                    <TopicFrequencyChart data={topicData} />
                  </div>
                </div>

                <div className="mt-6">
                  <RecordsTable records={records} />
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
        >
          ↑
        </button>
      )}

    </div>
  );
}
