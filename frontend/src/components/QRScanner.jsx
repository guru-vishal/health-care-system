import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";
import { BrowserQRCodeReader } from "@zxing/browser";

function isHttpUrl(value) {
	try {
		const u = new URL(String(value));
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
}

function getWorkerIdFromUrl(value) {
	try {
		const u = new URL(String(value));
		return u.searchParams.get("workerId") || u.searchParams.get("wid") || "";
	} catch {
		return "";
	}
}

function supportsQrBarcodeDetector() {
	return (
		typeof window !== "undefined" &&
		"BarcodeDetector" in window &&
		typeof window.BarcodeDetector === "function"
	);
}

function supportsGetUserMedia() {
	return (
		typeof navigator !== "undefined" &&
		Boolean(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function")
	);
}

export default function QRScanner({ workers, navigate, setSelectedWorker }) {
	const [workerId, setWorkerId] = useState("");
	const [status, setStatus] = useState(null);
	const [scanning, setScanning] = useState(false);
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const zxingControlsRef = useRef(null);

	const canScan = useMemo(
		() => supportsQrBarcodeDetector() || supportsGetUserMedia(),
		[]
	);

	const lookupWorker = useCallback(async (id) => {
		const raw = String(id || "").trim();
		if (!raw) return;

		setStatus({ type: "info", message: "Looking up worker…" });
		try {
			const foundLocal = workers?.find((w) => (w.id || w.workerId) === raw);
			const worker = foundLocal || (await api.getWorker(raw));

			const normalized = worker?.workerId
				? {
						id: worker.workerId,
						name: worker.name,
						age: worker.age,
						state: worker.state,
						bloodType: worker.bloodType,
						phone: worker.phone,
						emergency: worker.emergencyContact,
						role: worker.jobRole,
					}
				: worker;

			setSelectedWorker?.(normalized);
			setStatus({ type: "success", message: "Worker found" });
			navigate("profile", normalized);
		} catch (err) {
			setStatus({ type: "error", message: err.message || "Worker not found" });
		}
	}, [navigate, setSelectedWorker, workers]);

	const handleScannedValue = useCallback(async (value) => {
		const raw = String(value || "").trim();
		if (!raw) return;

		// If QR contains a URL, either:
		// - open the worker profile in-app (when URL contains workerId)
		// - otherwise redirect the browser to the scanned URL
		if (isHttpUrl(raw)) {
			const wid = getWorkerIdFromUrl(raw);
			if (wid) {
				await lookupWorker(wid);
				return;
			}
			setStatus({ type: "success", message: "Redirecting…" });
			window.location.assign(raw);
			return;
		}

		// Otherwise treat it as a Worker ID
		await lookupWorker(raw);
	}, [lookupWorker]);

	useEffect(() => {
		let rafId = null;
		let detector = null;
		let cancelled = false;

		async function startScan() {
			if (!scanning) return;
			if (!canScan) return;

			// Clear any old zxing controls
			if (zxingControlsRef.current) {
				try {
					zxingControlsRef.current.stop();
				} catch {
					// ignore
				}
				zxingControlsRef.current = null;
			}

			// Prefer native BarcodeDetector when available
			if (supportsQrBarcodeDetector()) {
				try {
					detector = new window.BarcodeDetector({ formats: ["qr_code"] });
				} catch {
					setStatus({ type: "error", message: "QR scanning not supported in this browser" });
					setScanning(false);
					return;
				}

				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: { facingMode: "environment" },
						audio: false,
					});
					streamRef.current = stream;
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
						await videoRef.current.play();
					}
				} catch {
					setStatus({ type: "error", message: "Camera permission denied" });
					setScanning(false);
					return;
				}

				const tick = async () => {
					try {
						const video = videoRef.current;
						if (video && video.readyState >= 2) {
							const barcodes = await detector.detect(video);
							if (barcodes && barcodes.length) {
								const value = barcodes[0]?.rawValue;
								if (value) {
									setWorkerId(value);
									setScanning(false);
									await handleScannedValue(value);
									return;
								}
							}
						}
					} catch {
						// ignore transient detection errors
					}
					rafId = requestAnimationFrame(tick);
				};

				rafId = requestAnimationFrame(tick);
				return;
			}

			// Fallback: ZXing scanner (works in more browsers)
			try {
				const reader = new BrowserQRCodeReader();
				const controls = await reader.decodeFromConstraints(
					{ video: { facingMode: "environment" } },
					videoRef.current,
					(result) => {
						const value = result?.getText?.() || "";
						if (!value || cancelled) return;
						setWorkerId(value);
						setScanning(false);
						handleScannedValue(value);
					}
				);
				zxingControlsRef.current = controls;
			} catch (err) {
				setStatus({
					type: "error",
					message: err?.message || "Unable to start QR scanner",
				});
				setScanning(false);
			}
		}

		startScan();

		return () => {
			cancelled = true;
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [scanning, canScan, handleScannedValue]);

	useEffect(() => {
		// stop camera when scanning toggles off/unmount
		if (!scanning && streamRef.current) {
			streamRef.current.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
		}
		if (!scanning && zxingControlsRef.current) {
			try {
				zxingControlsRef.current.stop();
			} catch {
				// ignore
			}
			zxingControlsRef.current = null;
		}
	}, [scanning]);

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex items-end justify-between gap-4 animate-fade-up">
				<div className="text-left">
					<div className="text-slate-400 text-sm">QR Lookup</div>
					<h1 className="text-3xl sm:text-4xl font-semibold text-white mt-1">Find Worker</h1>
					<p className="text-slate-300 mt-2">
						Scan a QR code (if supported) or enter the Worker ID.
					</p>
				</div>
				<button
					type="button"
					onClick={() => navigate("dashboard")}
					className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
				>
					← Back
				</button>
			</div>

			<div className="mt-8 grid lg:grid-cols-2 gap-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
					<div className="text-left">
						<div className="text-white font-semibold">Enter Worker ID</div>
						<div className="text-slate-400 text-sm mt-1">Example: KL-2024-0042</div>
					</div>

					<div className="mt-4 flex gap-2">
						<input
							value={workerId}
							onChange={(e) => setWorkerId(e.target.value)}
							placeholder="KL-2024-0042"
							className="flex-1 rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
						/>
						<button
							type="button"
							onClick={() => handleScannedValue(workerId)}
							className="px-5 py-3 rounded-2xl bg-teal-500/90 hover:bg-teal-400 text-slate-950 font-semibold transition-all"
						>
							Search
						</button>
					</div>

					{status ? (
						<div
							className={`mt-4 rounded-2xl border p-4 text-sm text-left
							${
								status.type === "success"
									? "border-teal-500/30 bg-teal-500/10 text-teal-200"
									: status.type === "error"
										? "border-red-500/30 bg-red-500/10 text-red-200"
										: "border-white/10 bg-white/5 text-slate-200"
							}`}
						>
							{status.message}
						</div>
					) : null}
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
					<div className="flex items-center justify-between">
						<div className="text-left">
							<div className="text-white font-semibold">Camera Scan</div>
							<div className="text-slate-400 text-sm mt-1">
								{supportsQrBarcodeDetector()
									? "Uses your browser's BarcodeDetector"
									: canScan
										? "Uses camera + ZXing fallback"
										: "Not supported in this browser"}
							</div>
						</div>
						<button
							type="button"
							disabled={!canScan}
							onClick={() => setScanning((s) => !s)}
							className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
						>
							{scanning ? "Stop" : "Start"}
						</button>
					</div>

					<div className="mt-4 relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30 aspect-video">
						<video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
						<div className="absolute inset-0 pointer-events-none">
							<div className="absolute inset-4 rounded-2xl border border-teal-500/40" />
							<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent animate-pulse" />
						</div>
						{!scanning ? (
							<div className="absolute inset-0 grid place-items-center">
								<div className="text-slate-300 text-sm text-center px-6">
									{canScan
										? "Click Start to scan a QR code"
										: "Use manual entry on the left"}
								</div>
							</div>
						) : null}
					</div>

					<div className="mt-4 text-slate-400 text-xs text-left">
						Tip: make sure the QR code encodes the Worker ID (e.g., KL-2024-0042).
					</div>
				</div>
			</div>
		</div>
	);
}

