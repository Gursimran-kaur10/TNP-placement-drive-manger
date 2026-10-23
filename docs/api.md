# API quick reference

Base path: `/api/drives`

| Method | Path | Success | Errors |
| --- | --- | --- | --- |
| `GET` | `/api/drives` | `200 OK`, JSON array ordered by drive date | `500 Server Error` |
| `POST` | `/api/drives` | `201 Created`, saved JSON record | `400 Bad Request`, `500 Server Error` |

The POST body requires `companyName`, `role`, `driveDate`, and `eligibleBranch`. `minCGPA` and `jobType` are optional. A bad JSON body or invalid field returns a 400 response with an error message; field validation errors are included in `fields`.
