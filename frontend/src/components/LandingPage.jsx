export default function LandingPage({ navigate }) {
	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-16">
			<div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
				<div className="text-left animate-fade-up">
					<div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-teal-200 text-sm">
						<span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
						Digital Health Record System
					</div>

					<h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
						Health Monitoring for
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 animate-shimmer bg-[length:200%_200%]">
							{" "}Migrant Workers{" "}
						</span>
						in Kerala
					</h1>
					<p className="mt-4 text-slate-300 leading-relaxed max-w-xl">
						Register workers, store medical records securely, and retrieve history instantly using a
						unique worker ID or QR lookup.
					</p>

					<div className="mt-8 flex flex-col sm:flex-row gap-3">
						<button
							type="button"
							onClick={() => navigate("login")}
							className="group inline-flex items-center justify-center rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 px-6 py-3 font-semibold transition-all duration-200 shadow-lg shadow-teal-500/20"
						>
							Staff Login
							<span className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
						</button>
						<button
							type="button"
							onClick={() => navigate("register")}
							className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 py-3 font-semibold transition-all duration-200"
						>
							Create Account
						</button>
					</div>

					<div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<div className="text-white font-semibold">Fast Retrieval</div>
							<div className="text-slate-300 mt-1">Search by Worker ID / QR</div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<div className="text-white font-semibold">Medical Timeline</div>
							<div className="text-slate-300 mt-1">View visit history instantly</div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<div className="text-white font-semibold">Role-based Access</div>
							<div className="text-slate-300 mt-1">Secure staff authentication</div>
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-teal-500/20 via-emerald-500/10 to-cyan-500/20 blur-2xl" />
					<div className="relative rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl">
						<div className="flex items-center justify-between">
							<div className="text-left">
								<div className="text-slate-300 text-sm">Quick Actions</div>
								<div className="text-white font-semibold">Start a workflow</div>
							</div>
							<div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 grid place-items-center animate-float">
								<span className="text-teal-200 font-bold">H</span>
							</div>
						</div>

						<div className="mt-6 grid gap-3">
							<button
								type="button"
								onClick={() => navigate("qr-scanner")}
								className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-4 transition-all"
							>
								<div className="text-white font-semibold">Lookup Worker</div>
								<div className="text-slate-300 text-sm">Scan or enter Worker ID</div>
							</button>
							<button
								type="button"
								onClick={() => navigate("register")}
								className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-4 transition-all"
							>
								<div className="text-white font-semibold">Register Staff</div>
								<div className="text-slate-300 text-sm">Create a secure account</div>
							</button>
							<button
								type="button"
								onClick={() => navigate("login")}
								className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-4 transition-all"
							>
								<div className="text-white font-semibold">Open Dashboard</div>
								<div className="text-slate-300 text-sm">Manage workers & records</div>
							</button>
						</div>

						<div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left">
							<div className="text-slate-300 text-sm">Tip</div>
							<div className="text-slate-200 text-sm mt-1">
								Use <span className="text-teal-200 font-semibold">QR Lookup</span> for quick patient
								identification at clinics.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

