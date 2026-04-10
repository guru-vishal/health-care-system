import { useEffect, useState } from "react";
import { api } from "../lib/api";
import QRCode from "qrcode";

function InfoPill({ label, value }) {
	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
			<div className="text-slate-400 text-xs">{label}</div>
			<div className="text-slate-100 font-semibold mt-1 break-words">{value || "—"}</div>
		</div>
	);
}

export default function WorkerProfile({ worker, navigate, currentUser }) {
	const wid = worker?.id || worker?.workerId;
	const [records, setRecords] = useState([]);
	const [loading, setLoading] = useState(false);
	const [qrUrl, setQrUrl] = useState(null);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			if (!wid) return;
			setLoading(true);
			try {
				const recs = await api.listWorkerRecords(wid);
				if (!cancelled) setRecords(recs);
			} catch {
				if (!cancelled) setRecords([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [wid]);

	useEffect(() => {
		let cancelled = false;
		async function gen() {
			if (!wid) return;
			try {
				const url = await QRCode.toDataURL(String(wid), {
					margin: 1,
					width: 320,
				});
				if (!cancelled) setQrUrl(url);
			} catch {
				if (!cancelled) setQrUrl(null);
			}
		}
		gen();
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
					<div className="text-slate-400 text-sm">Worker Profile</div>
					<h1 className="text-3xl sm:text-4xl font-semibold text-white mt-1">{worker.name}</h1>
					<div className="text-slate-300 mt-2 text-sm">Worker ID: {wid}</div>
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
						onClick={() => navigate("history", worker)}
						className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
					>
						View History
					</button>
					<button
						type="button"
						onClick={() => navigate("dashboard")}
						className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
					>
						← Back
					</button>
				</div>
			</div>

			<div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<InfoPill label="Age" value={worker.age} />
				<InfoPill label="State" value={worker.state} />
				<InfoPill label="Blood Type" value={worker.bloodType} />
				<InfoPill label="Phone" value={worker.phone} />
				<InfoPill label="Emergency" value={worker.emergency || worker.emergencyContact} />
				<InfoPill label="Role" value={worker.role || worker.jobRole} />
			</div>

			<div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
				<div className="flex items-center justify-between">
					<div className="text-left">
						<div className="text-white font-semibold">Recent Records</div>
						<div className="text-slate-400 text-sm">
							{loading ? "Loading…" : `${records.length} total`}
						</div>
					</div>
					<div className="text-slate-400 text-sm">Signed in as {currentUser?.name || "—"}</div>
				</div>

				<div className="mt-4 grid gap-3">
					{records.slice(0, 3).map((r) => (
						<div
							key={r._id || r.id}
							className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-left"
						>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<div className="text-slate-100 font-semibold">
									{r.diagnosis || "Medical visit"}
								</div>
								<div className="text-xs text-slate-400">
									{r.visitDate ? new Date(r.visitDate).toLocaleDateString() : "—"}
								</div>
							</div>
							<div className="text-slate-300 text-sm mt-1">
								{r.hospitalName ? `${r.hospitalName} • ` : ""}
								{r.doctorName || ""}
							</div>
						</div>
					))}
					{!loading && records.length === 0 ? (
						<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-6 text-left">
							<div className="text-white font-semibold">No records yet</div>
							<div className="text-slate-300 text-sm mt-2">
								Add the first medical record for this worker.
							</div>
							<button
								type="button"
								onClick={() => navigate("add-record", worker)}
								className="mt-4 px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all"
							>
								Add Record
							</button>
						</div>
					) : null}
				</div>
			</div>

			<div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
				<div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
					<div className="text-left">
						<div className="text-white font-semibold">Worker QR Code</div>
						<div className="text-slate-400 text-sm mt-1">
							Scan this in QR Lookup to open the profile.
						</div>
						<div className="text-slate-300 text-sm mt-2">Value: {wid}</div>
					</div>
					<div className="shrink-0">
						{qrUrl ? (
							<img
								src={qrUrl}
								alt={`QR for ${wid}`}
								className="w-44 h-44 rounded-3xl bg-white p-3"
							/>
						) : (
							<div className="w-44 h-44 rounded-3xl bg-slate-950/30 border border-white/10 grid place-items-center text-slate-400 text-sm">
								QR unavailable
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

