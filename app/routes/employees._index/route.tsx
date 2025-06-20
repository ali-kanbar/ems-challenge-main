import { useLoaderData, useNavigate } from "react-router"
import { getDB } from "~/db/getDB"
import { useState, useMemo } from "react"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")
  return { employees }
}

export default function EmployeesPage() {
  const { employees: initialEmployees } = useLoaderData()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterDepartment, setFilterDepartment] = useState("")

  const departments = [...new Set(initialEmployees.map((emp: { department: string }) => emp.department))]

  const processedEmployees = useMemo(() => {
    let result = [...initialEmployees]

    if (searchTerm) {
      result = result.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterDepartment) {
      result = result.filter(emp => emp.department === filterDepartment)
    }

    result.sort((a, b) => {
      const nameA = a.full_name.toLowerCase()
      const nameB = b.full_name.toLowerCase()
      return sortOrder === "asc" ? nameA > nameB ? 1 : -1 : nameA < nameB ? 1 : -1
    })

    return result
  }, [initialEmployees, searchTerm, sortOrder, filterDepartment])

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div>
      <h1>Employees</h1>

      <input
        type="text"
        placeholder="Search employees by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={filterDepartment}
        onChange={(e) => setFilterDepartment(e.target.value)}
      >
        <option value="">All Departments</option>
        {departments.map(dep => (
          <option key={dep as string} value={dep as string}>{dep as string}</option>
        ))}
      </select>

      {processedEmployees.length === 0 ? (
        <div>
          <p>No employees found.</p>
          <p><a href="/employees/new">Create the first employee</a></p>
        </div>
      ) : (
        <div>
          <table border={1}>
            <thead>
              <tr>
                <th onClick={handleSort}>
                  Name {sortOrder === "asc" ? "↑" : "↓"}
                </th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.job_title}</td>
                  <td>{employee.department}</td>
                  <td>{employee.email}</td>
                  <td>
                    <a href={`/employees/${employee.id}`}>View Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total employees: {processedEmployees.length}</p>
        </div>
      )}
      <div>
        <button onClick={() => navigate("/employees/new")}>Create New Employee</button>
        <button onClick={() => navigate("/timesheets")}>Check Timesheets</button>
      </div>
    </div>
  )
}