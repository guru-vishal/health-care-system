function StatCard({ label, value, hint }) {
	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
			<div className="text-slate-300 text-sm">{label}</div>
			<div className="mt-1 text-white text-2xl font-semibold">{value}</div>
			{hint ? <div className="mt-1 text-slate-400 text-xs">{hint}</div> : null}
		</div>
	);
}

function WorkerCard({ worker, onOpen }) {
	const wid = worker?.id || worker?.workerId;
	return (
		<div className="group rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all p-5 text-left">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="text-white font-semibold text-lg leading-tight">{worker?.name}</div>
					<div className="text-slate-400 text-sm mt-1">Worker ID: {wid}</div>
				</div>
				<div className="shrink-0 rounded-2xl border border-teal-500/25 bg-teal-500/10 px-3 py-2 text-teal-200 text-sm font-semibold">
					{worker?.bloodType || "—"}
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
				<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
					<div className="text-slate-400 text-xs">State</div>
					<div className="text-slate-200 font-medium mt-0.5">{worker?.state || "—"}</div>
				</div>
				<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
					<div className="text-slate-400 text-xs">Role</div>
					<div className="text-slate-200 font-medium mt-0.5">{worker?.role || worker?.jobRole || "—"}</div>
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => onOpen("profile")}
					className="px-4 py-2 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition-all"
				>
					View Profile
				</button>
				<button
					type="button"
					onClick={() => onOpen("add-record")}
					className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all"
				>
					Add Record
				</button>
				<button
					type="button"
					onClick={() => onOpen("history")}
					className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all"
				>
					View History
				</button>
			</div>
		</div>
	);
}

export default function Dashboard({ workers, currentUser, navigate, setSelectedWorker }) {
	const totalWorkers = workers?.length || 0;
	const staffName = currentUser?.name || "Staff";

	const openWorker = (worker, page) => {
		setSelectedWorker?.(worker);
		navigate(page, worker);
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up">
				<div className="text-left">
					<div className="text-slate-400 text-sm">Welcome, {staffName}</div>
					<h1 className="text-3xl sm:text-4xl font-semibold text-white mt-1">Dashboard</h1>
					<p className="text-slate-300 mt-2">
						Manage worker profiles and medical records.
					</p>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => navigate("register-worker")}
						className="px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-lg shadow-teal-500/20"
					>
						+ Register Worker
					</button>
					<button
						type="button"
						onClick={() => navigate("qr-scanner")}
						className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
					>
						QR Lookup
					</button>
				</div>
			</div>

			<div className="mt-8 grid sm:grid-cols-3 gap-4">
				<StatCard label="Total Workers" value={totalWorkers} hint="Registered profiles" />
				<StatCard label="Quick Lookup" value="QR / ID" hint="Faster triage" />
				<StatCard label="Records" value="Timeline" hint="Visit history" />
			</div>

			<div className="mt-10">
				<div className="flex items-center justify-between">
					<h2 className="text-white font-semibold text-lg">Workers</h2>
					<div className="text-slate-400 text-sm">Newest first</div>
				</div>

				<div className="mt-4 grid md:grid-cols-2 gap-4">
					{workers?.length ? (
						workers.map((w) => (
							<WorkerCard
								key={w.id || w.workerId}
								worker={w}
								onOpen={(page) => openWorker(w, page)}
							/>
						))
					) : (
						<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
							<div className="text-white font-semibold">No workers yet</div>
							<div className="text-slate-300 mt-2 text-sm">
								Register a worker to start tracking health records.
							</div>
							<button
								type="button"
								onClick={() => navigate("register-worker")}
								className="mt-5 px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all"
							>
								Register Worker
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

