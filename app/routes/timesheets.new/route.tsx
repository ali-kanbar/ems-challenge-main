import { useLoaderData, Form, redirect, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

    const formatDateTime = (datetimeLocal: string) => {
    if (!datetimeLocal) return null;
    let formatted = datetimeLocal.replace('T', ' ');
    if (formatted.length === 16) {
      formatted += ':00';
    }
    return formatted;
  };

  const formattedStartTime = formatDateTime(start_time as string);
  const formattedEndTime = formatDateTime(end_time as string);

  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
    [employee_id, formattedStartTime, formattedEndTime, summary]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Create New Timesheet</h1>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" required>
            <option value="">Select an employee</option>
            {employees.map((employee : any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div> <br />
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" required />
        </div><br />
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" required />
        </div> <br />
        <div>
          <label htmlFor="summary">Summary</label>
          <textarea></textarea>
        </div> <br />
        <button type="submit">Create Timesheet</button>
      </Form>
      <hr />
      <div>
        <button
          type="button"
          onClick={() => {
            const employeeSelect = document.getElementById("employee_id") as HTMLSelectElement;
            const employeeId = employeeSelect?.value;
            if (employeeId) {
              navigate(`/employees/${employeeId}`);
            } else {
              alert("Please select an employee first");
            }
          }}
        >
          Go to Selected Employee
        </button>
        <br />
        <button type="button" onClick={() => navigate("/employees")}>
          Go to Employees List
        </button>
        <br />
        <button type="button" onClick={() => navigate("/timesheets")}>
          Go to Timesheets List
        </button>
      </div>
    </div>
  );
}
