import { useState } from "react";

export default function MedicalRecord({ worker, navigate, addRecord, showNotification }) {
	const wid = worker?.id || worker?.workerId;
	const [visitDate, setVisitDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [doctorName, setDoctorName] = useState("");
	const [hospitalName, setHospitalName] = useState("");
	const [diagnosis, setDiagnosis] = useState("");
	const [prescription, setPrescription] = useState("");
	const [notes, setNotes] = useState("");
	const [reportFile, setReportFile] = useState(null);
	const [saving, setSaving] = useState(false);

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

	const onSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await addRecord(wid, {
				visitDate,
				doctorName,
				hospitalName,
				diagnosis,
				prescription,
				notes,
				reportFile,
			});
			showNotification?.("Medical record added successfully!");
			navigate("history", worker);
		} catch (err) {
			showNotification?.(err.message || "Failed to add record", "error");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex items-end justify-between gap-4 animate-fade-up">
				<div className="text-left">
					<div className="text-slate-400 text-sm">Add Medical Record</div>
					<h1 className="text-3xl font-semibold text-white mt-1">{worker.name}</h1>
					<div className="text-slate-300 text-sm mt-2">Worker ID: {wid}</div>
				</div>
				<button
					type="button"
					onClick={() => navigate("profile", worker)}
					className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
				>
					← Back
				</button>
			</div>

			<form
				onSubmit={onSubmit}
				className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl"
			>
				<div className="grid sm:grid-cols-2 gap-4">
					<label className="text-left grid gap-2">
						<span className="text-slate-200 text-sm font-medium">Visit date</span>
						<input
							type="date"
							value={visitDate}
							onChange={(e) => setVisitDate(e.target.value)}
							className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-teal-500/40"
							required
						/>
					</label>

					<label className="text-left grid gap-2">
						<span className="text-slate-200 text-sm font-medium">Report file (PDF/Image)</span>
						<input
							type="file"
							accept="application/pdf,image/*"
							onChange={(e) => setReportFile(e.target.files?.[0] || null)}
							className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-slate-200 file:font-semibold hover:file:bg-white/15 outline-none focus:ring-2 focus:ring-teal-500/40"
						/>
					</label>
				</div>

				<div className="grid sm:grid-cols-2 gap-4 mt-4">
					<label className="text-left grid gap-2">
						<span className="text-slate-200 text-sm font-medium">Doctor</span>
						<input
							value={doctorName}
							onChange={(e) => setDoctorName(e.target.value)}
							placeholder="Dr. …"
							className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
							required
						/>
					</label>
					<label className="text-left grid gap-2">
						<span className="text-slate-200 text-sm font-medium">Hospital / Facility</span>
						<input
							value={hospitalName}
							onChange={(e) => setHospitalName(e.target.value)}
							placeholder="Government Medical College …"
							className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
							required
						/>
					</label>
				</div>

				<label className="text-left grid gap-2 mt-4">
					<span className="text-slate-200 text-sm font-medium">Diagnosis</span>
					<input
						value={diagnosis}
						onChange={(e) => setDiagnosis(e.target.value)}
						placeholder="Respiratory tract infection"
						className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
						required
					/>
				</label>

				<label className="text-left grid gap-2 mt-4">
					<span className="text-slate-200 text-sm font-medium">Prescription</span>
					<input
						value={prescription}
						onChange={(e) => setPrescription(e.target.value)}
						placeholder="Azithromycin 500mg, Cetirizine 10mg"
						className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
					/>
				</label>

				<label className="text-left grid gap-2 mt-4">
					<span className="text-slate-200 text-sm font-medium">Notes</span>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={4}
						placeholder="Follow-up advice, restrictions, vitals, etc."
						className="w-full resize-y rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
					/>
				</label>

				<div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
					<button
						type="button"
						onClick={() => navigate("profile", worker)}
						className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={saving}
						className="px-6 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold transition-all shadow-lg shadow-teal-500/20"
					>
						{saving ? "Saving…" : "Save Record"}
					</button>
				</div>
			</form>
		</div>
	);
}

