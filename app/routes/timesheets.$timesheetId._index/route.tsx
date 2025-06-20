import { useLoaderData, useNavigate } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader({ params }: { params: any }) {
  const db = await getDB()
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  )

  return { timesheet }
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData()
  const navigate = useNavigate()

  return (
    <div>
      <div>
        <h1>Timesheet Details</h1>
        <p><strong>ID:</strong> {timesheet.id}</p>
        <p><strong>Employee:</strong> {timesheet.full_name} (ID: {timesheet.employee_id})</p>
        <p><strong>Start Time:</strong> {timesheet.start_time}</p>
        <p><strong>End Time:</strong> {timesheet.end_time}</p>
        <p><strong>Summary:</strong> {timesheet.summary}</p>
      </div>
      <button onClick={() => navigate("/timesheets")}>View All Timesheets</button><br />
      <button onClick={() => navigate("/timesheets/new")}>Create New Timesheet</button><br />
      <button onClick={() => navigate("/employees")}>View All Employees</button><br />
    </div>
  )
}