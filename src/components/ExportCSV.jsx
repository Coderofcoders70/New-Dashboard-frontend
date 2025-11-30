export default function ExportCSV({ data }) {
  function downloadCSV() {
    if (!Array.isArray(data) || data.length === 0) return;

    const keys = Object.keys(data[0]);
    const header = keys.join(",");
    const rows = data.map(row =>
      keys.map(k => {
        const v = row[k] === null || row[k] === undefined ? "" : String(row[k]);
        return `"${v.replace(/"/g, '""')}"`;
      }).join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "records.csv";
    // add class for small-screen export button to trigger if needed
    a.className = "export-btn";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={downloadCSV}
      className="export-btn px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 dark:bg-green-400 dark:text-black transition"
    >
      Export CSV
    </button>
  );
}
