const allowedJobTypes = ["Internship", "Full-Time", "Other"]

export function validateDrive(data) {
  const errors = {}

  if (typeof data.companyName !== "string" || !data.companyName.trim()) {
    errors.companyName = "Company name is required."
  }
  if (typeof data.role !== "string" || !data.role.trim()) {
    errors.role = "Job role is required."
  }
  if (typeof data.eligibleBranch !== "string" || !data.eligibleBranch.trim()) {
    errors.eligibleBranch = "Eligible branches are required."
  }

  const date = new Date(data.driveDate)
  if (!data.driveDate || Number.isNaN(date.getTime())) {
    errors.driveDate = "Enter a valid drive date."
  }

  let minCGPA = null
  if (data.minCGPA !== "" && data.minCGPA !== null && data.minCGPA !== undefined) {
    minCGPA = Number(data.minCGPA)
    if (!Number.isFinite(minCGPA) || minCGPA < 0 || minCGPA > 10) {
      errors.minCGPA = "CGPA must be between 0 and 10."
    }
  }

  let jobType = null
  if (data.jobType) {
    if (!allowedJobTypes.includes(data.jobType)) {
      errors.jobType = "Choose a valid job type."
    } else {
      jobType = data.jobType
    }
  }

  if (Object.keys(errors).length) return { errors }

  return {
    value: {
      companyName: data.companyName.trim(),
      role: data.role.trim(),
      driveDate: date,
      eligibleBranch: data.eligibleBranch.trim(),
      minCGPA,
      jobType,
    },
  }
}
