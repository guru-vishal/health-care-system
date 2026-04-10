import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function HealthHistory({ worker, navigate }) {
	const wid = worker?.id || worker?.workerId;
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			if (!wid) return;
			setLoading(true);
			setError(null);
			try {
				const data = await api.listWorkerRecords(wid);
				if (!cancelled) setRecords(data);
			} catch (err) {
				if (!cancelled) setError(err.message || "Failed to load records");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [wid]);

	if (!worker) {
		return (
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
					<div className="text-white font-semibold">No worker selected</div>
					<button
						type="button"
						onClick={() => navigate("dashboard")}
						className="mt-4 px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all"
					>
						Go to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up">
				<div className="text-left">
					<div className="text-slate-400 text-sm">Health History</div>
					<h1 className="text-3xl sm:text-4xl font-semibold text-white mt-1">{worker.name}</h1>
					<div className="text-slate-300 text-sm mt-2">Worker ID: {wid}</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => navigate("add-record", worker)}
						className="px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-lg shadow-teal-500/20"
					>
						+ Add Record
					</button>
					<button
						type="button"
						onClick={() => navigate("profile", worker)}
						className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
					>
						← Back
					</button>
				</div>
			</div>

			{error ? (
				<div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-left text-red-200">
					{error}
				</div>
			) : null}

			<div className="mt-8 grid gap-4">
				{loading ? (
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
						<div className="text-white font-semibold">Loading records…</div>
						<div className="text-slate-400 text-sm mt-2">Fetching timeline from backend</div>
					</div>
				) : records.length ? (
					records.map((r) => (
						<div
							key={r._id || r.id}
							className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10 transition-all"
						>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="text-white font-semibold text-lg">
									{r.diagnosis || "Medical Visit"}
								</div>
								<div className="flex items-center gap-2">
									<div className="text-slate-400 text-sm">
										{r.visitDate ? new Date(r.visitDate).toLocaleDateString() : "—"}
									</div>
								</div>
							</div>

							<div className="mt-2 text-slate-300 text-sm">
								{r.hospitalName ? `${r.hospitalName} • ` : ""}
								{r.doctorName || ""}
							</div>

							<div className="mt-4 grid sm:grid-cols-2 gap-4">
								<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
									<div className="text-slate-400 text-xs">Prescription</div>
									<div className="text-slate-200 text-sm mt-1">{r.prescription || "—"}</div>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
									<div className="text-slate-400 text-xs">Notes</div>
									<div className="text-slate-200 text-sm mt-1">{r.notes || "—"}</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
						<div className="text-white font-semibold">No medical history found</div>
						<div className="text-slate-300 text-sm mt-2">
							Add the first record to start the timeline.
						</div>
						<button
							type="button"
							onClick={() => navigate("add-record", worker)}
							className="mt-5 px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all"
						>
							Add Record
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

