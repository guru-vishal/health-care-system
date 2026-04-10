function NavButton({ page, label, navigate, currentPage }) {
	return (
		<button
			type="button"
			onClick={() => navigate(page)}
			className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border
				${
					currentPage === page
						? "bg-teal-500/15 border-teal-500/30 text-teal-200"
						: "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200"
				}`}
		>
			{label}
		</button>
	);
}

export default function Navbar({ currentUser, onLogout, navigate, currentPage }) {

	return (
		<header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
				<button
					type="button"
					onClick={() => navigate("dashboard")}
					className="flex items-center gap-3"
				>
					<div className="h-10 w-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 grid place-items-center">
						<span className="text-teal-200 font-bold">H</span>
					</div>
					<div className="text-left">
						<div className="text-white font-semibold leading-tight">Health Monitoring</div>
						<div className="text-slate-400 text-xs">Digital Worker Health Records</div>
					</div>
				</button>

				<nav className="hidden md:flex items-center gap-2">
					<NavButton page="dashboard" label="Dashboard" navigate={navigate} currentPage={currentPage} />
					<NavButton page="qr-scanner" label="QR Lookup" navigate={navigate} currentPage={currentPage} />
					<NavButton page="register-worker" label="Register Worker" navigate={navigate} currentPage={currentPage} />
					<NavButton page="settings" label="Settings" navigate={navigate} currentPage={currentPage} />
				</nav>

				<div className="flex items-center gap-3">
					<div className="hidden sm:block text-right">
						<div className="text-slate-200 text-sm font-medium">
							{currentUser?.name || "Guest"}
						</div>
						<div className="text-slate-400 text-xs">{currentUser?.role || ""}</div>
					</div>
					<button
						type="button"
						onClick={onLogout}
						className="px-4 py-2 rounded-2xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
					>
						Logout
					</button>
				</div>
			</div>

			<div className="md:hidden px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
				<NavButton page="dashboard" label="Dashboard" navigate={navigate} currentPage={currentPage} />
				<NavButton page="qr-scanner" label="QR Lookup" navigate={navigate} currentPage={currentPage} />
				<NavButton page="register-worker" label="Register Worker" navigate={navigate} currentPage={currentPage} />
				<NavButton page="settings" label="Settings" navigate={navigate} currentPage={currentPage} />
			</div>
		</header>
	);
}

