"use client"

import { useEffect, useMemo, useState } from "react"

const emptyForm = {
  companyName: "",
  role: "",
  driveDate: "",
  eligibleBranch: "",
  minCGPA: "",
  jobType: "",
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function DriveManager() {
  const [drives, setDrives] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState({ kind: "loading", message: "Loading placement drives..." })
  const [saving, setSaving] = useState(false)

  async function loadDrives() {
    try {
      const response = await fetch("/api/drives", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not load placement drives.")
      setDrives(data)
      setStatus({ kind: "ready", message: "" })
    } catch (error) {
      setStatus({ kind: "error", message: error.message })
    }
  }

  useEffect(() => {
    loadDrives()
  }, [])

  const visibleDrives = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return drives
    return drives.filter((drive) =>
      [drive.companyName, drive.role, drive.eligibleBranch].some((value) => value.toLowerCase().includes(query))
    )
  }, [drives, search])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitForm(event) {
    event.preventDefault()
    setSaving(true)
    setStatus({ kind: "ready", message: "" })

    try {
      const response = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        const details = data.fields ? Object.values(data.fields).join(" ") : data.error
        throw new Error(details || "Could not save the placement drive.")
      }

      setForm(emptyForm)
      setStatus({ kind: "success", message: "Placement drive added successfully." })
      await loadDrives()
    } catch (error) {
      setStatus({ kind: "error", message: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-brand-blue text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 text-sm font-bold">T&amp;P</div>
            <div>
              <p className="text-lg font-semibold sm:text-xl">Training &amp; Placement Cell</p>
              <p className="text-xs text-blue-100">Placement Drive Manager</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-white/15 px-4 py-2 text-sm sm:inline-block">Staff workspace</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-blue">T&amp;P Cell</p>
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">Placement drives</h1>
            <p className="mt-2 max-w-xl text-slate-600">Add upcoming opportunities and keep the drive details in one place.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Drives listed</p>
            <p className="text-2xl font-bold text-brand-navy">{drives.length}</p>
          </div>
        </section>

        {status.message && (
          <div role="status" className={`mb-6 rounded-lg border px-4 py-3 text-sm ${status.kind === "error" ? "border-red-200 bg-red-50 text-red-700" : status.kind === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-white text-slate-600"}`}>
            {status.message}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Upcoming opportunities</h2>
                <p className="mt-1 text-sm text-slate-500">Sorted by drive date</p>
              </div>
              <label className="sr-only" htmlFor="drive-search">Search drives</label>
              <input
                id="drive-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company, role, branch"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
              />
            </div>

            {status.kind === "loading" ? null : visibleDrives.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                <p className="font-semibold text-slate-700">{search ? "No matching drives" : "No drives added yet"}</p>
                <p className="mt-1 text-sm text-slate-500">{search ? "Try another company, role, or branch." : "Add the first placement drive using the form."}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleDrives.map((drive) => (
                  <article key={drive.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-brand-navy">{drive.companyName}</h3>
                          {drive.jobType && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue">{drive.jobType}</span>}
                        </div>
                        <p className="mt-1 text-slate-700">{drive.role}</p>
                      </div>
                      <p className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{formatDate(drive.driveDate)}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-700">Branches:</span> {drive.eligibleBranch}</p>
                      <p><span className="font-semibold text-slate-700">Minimum CGPA:</span> {drive.minCGPA ?? "Not specified"}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-800">Add a drive</h2>
              <p className="mt-1 text-sm text-slate-500">Enter the details shared by the company.</p>
            </div>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="mb-1.5 block text-sm font-semibold text-slate-700">Company name <span className="text-red-500">*</span></label>
                <input id="companyName" name="companyName" required value={form.companyName} onChange={updateField} placeholder="e.g. Acme Technologies" className="form-input" />
              </div>
              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-semibold text-slate-700">Job role <span className="text-red-500">*</span></label>
                <input id="role" name="role" required value={form.role} onChange={updateField} placeholder="e.g. Graduate Engineer Trainee" className="form-input" />
              </div>
              <div>
                <label htmlFor="driveDate" className="mb-1.5 block text-sm font-semibold text-slate-700">Drive date <span className="text-red-500">*</span></label>
                <input id="driveDate" name="driveDate" type="date" required value={form.driveDate} onChange={updateField} className="form-input" />
              </div>
              <div>
                <label htmlFor="eligibleBranch" className="mb-1.5 block text-sm font-semibold text-slate-700">Eligible branches <span className="text-red-500">*</span></label>
                <input id="eligibleBranch" name="eligibleBranch" required value={form.eligibleBranch} onChange={updateField} placeholder="e.g. CSE, IT, ECE" className="form-input" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="minCGPA" className="mb-1.5 block text-sm font-semibold text-slate-700">Minimum CGPA</label>
                  <input id="minCGPA" name="minCGPA" type="number" min="0" max="10" step="0.01" value={form.minCGPA} onChange={updateField} placeholder="e.g. 7.0" className="form-input" />
                </div>
                <div>
                  <label htmlFor="jobType" className="mb-1.5 block text-sm font-semibold text-slate-700">Job type</label>
                  <select id="jobType" name="jobType" value={form.jobType} onChange={updateField} className="form-input">
                    <option value="">Select type</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button disabled={saving} type="submit" className="w-full rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving drive..." : "Add placement drive"}
              </button>
              <p className="text-center text-xs text-slate-500">Fields marked with * are required.</p>
            </form>
          </section>
        </div>
        <footer className="mt-8 text-center text-xs text-slate-500">Training &amp; Placement Cell · Drive information for students and staff</footer>
      </main>
    </div>
  )
}
