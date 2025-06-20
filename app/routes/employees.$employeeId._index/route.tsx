import { useLoaderData, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: any }) {
  const db = await getDB();
  const employee = await db.get('SELECT * FROM employees WHERE id = ?', [params.employeeId]);

  const timesheets = await db.all(
    'SELECT * FROM timesheets WHERE employee_id = ? ORDER BY start_time DESC',
    [params.employeeId]
  );
  
  return { employee, timesheets };
}

export default function EmployeePage() {
  const { employee, timesheets } = useLoaderData();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Employee : {employee.full_name}</h1>
      
      <div>
        <h2>Personal Information</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>Full Name:</strong></td>
              <td>{employee.full_name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{employee.email}</td>
            </tr>
            <tr>
              <td><strong>Phone Number:</strong></td>
              <td>{employee.phone_number}</td>
            </tr>
            <tr>
              <td><strong>Date of Birth:</strong></td>
              <td>{employee.date_of_birth}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div>
        <h2>Professional Information</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>Job Title:</strong></td>
              <td>{employee.job_title}</td>
            </tr>
            <tr>
              <td><strong>Department:</strong></td>
              <td>{employee.department}</td>
            </tr>
            <tr>
              <td><strong>Salary:</strong></td>
              <td>{`$${parseFloat(employee.salary).toLocaleString()}`}</td>
            </tr>
            <tr>
              <td><strong>Start Date:</strong></td>
              <td>{employee.start_date}</td>
            </tr>
            <tr>
              <td><strong>End Date:</strong></td>
              <td>{employee.end_date}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div>
        <h2>Timesheet History ({timesheets.length} records)</h2>
        {timesheets.length === 0 ? (
          <p>No timesheets found for this employee.</p>
        ) : (
          <div>
            {timesheets.map((timesheet: any) => (
              <div key={timesheet.id}>
                <h4>Timesheet #{timesheet.id}</h4>
                <ul>
                  <li><strong>Start Time:</strong> {timesheet.start_time}</li>
                  <li><strong>End Time:</strong> {timesheet.end_time}</li>
                </ul>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3>Navigation</h3>
        <button onClick={() => navigate("/employees")}>Back to Employees List</button><br/>
        <button onClick={() => navigate("/employees/new")}>Add New Employee</button><br/>
        <button onClick={() => navigate(`/timesheets/${employee.id}`)}>Create Timesheet for ${employee.full_name}</button><br/>
        <button onClick={() => navigate("/timesheets")}>View All Timesheets</button><br/>
      </div>
    </div>
  )
}