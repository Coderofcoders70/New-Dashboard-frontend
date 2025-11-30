import { useState } from "react";

/**
 * Responsive table:
 * - Desktop/tablet: native table with horizontal scroll if needed
 * - Very small screens: card list fallback (table-cards)
 */
export default function RecordsTable({ records = [] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = records.slice(start, start + pageSize);

  function prev() { setPage(p => Math.max(1, p - 1)); }
  function next() { setPage(p => Math.min(totalPages, p + 1)); }

  return (
    <div className="bg-gray-300 dark:bg-gray-800 rounded-xl shadow p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Records</h4>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">Rows</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white">
            {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Native table for medium+ screens */}
      <div className="table-wrapper table-scroll">
        <table className="w-full text-left text-sm table-native">
          <thead className="text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Topic</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">End Year</th>
            </tr>
          </thead>
          <tbody>
            {current.map((r, idx) => (
              <tr key={idx} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{r.title ?? "-"}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{r.topic ?? "-"}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{r.country ?? "-"}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{r.end_year ?? r.start_year ?? "-"}</td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr><td colSpan="4" className="px-3 py-6 text-center text-gray-600 dark:text-gray-300">No records</td></tr>
            )}
          </tbody>
        </table>

        {/* Card fallback for tiny screens */}
        <div className="table-cards">
          {current.map((r, idx) => (
            <div key={idx} className="record-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{r.title ?? "-"}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{r.topic ?? "-"}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{r.end_year ?? r.start_year ?? "-"}</div>
              </div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{r.country ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {records.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, records.length)} of {records.length}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prev} disabled={page===1} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50">Prev</button>
          <div className="text-sm text-gray-700 dark:text-gray-300">Page {page} / {totalPages}</div>
          <button onClick={next} disabled={page===totalPages} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
