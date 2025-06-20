import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [viewMode, setViewMode] = useState('table');
  const [filterEmployee, setFilterEmployee] = useState("");
  const navigate = useNavigate();

  const employees = [...new Set(timesheetsAndEmployees.map((timesheet: any) => timesheet.full_name))];

  const filteredTimesheets = useMemo(() => {
    let result = [...timesheetsAndEmployees];
    if (filterEmployee) {
      result = result.filter(timesheet => timesheet.full_name === filterEmployee);
    }
    return result;
  }, [timesheetsAndEmployees, filterEmployee]);

  const events = filteredTimesheets.map((timesheet: any) => {
    const extractTime = (datetimeString: string) => {
      const parts = datetimeString.split(' ');
      return parts[0]; 
    };
    
    return {
      id: timesheet.id,
      title: `Timesheet for ${timesheet.full_name}`,
      start: extractTime(timesheet.start_time),
      end: extractTime(timesheet.end_time),
      employee_id: timesheet.employee_id,
      description: timesheet.summary,
    };
  });

  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),
      createViewWeek(),
      createViewDay(),
      createViewMonthAgenda(),
    ],
    events,
    defaultView: 'monthGrid',
  });

  return (
    <div>
      <div>
        <button onClick={() => setViewMode('table')}>
          Table View
        </button>
        <button onClick={() => setViewMode('calendar')}>
          Calendar View
        </button>
      </div>
      <div>
        <select
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp as string} value={emp as string}>{emp as string}</option>
          ))}
        </select>
      </div>
      {viewMode === 'table' ? (
        <div>
          <table border={1}>
            <thead>
              <tr>
                <th>Timesheet ID</th>
                <th>Employee</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.map((timesheet: any) => (
                <tr key={timesheet.id}>
                  <td>{timesheet.id}</td>
                  <td>{timesheet.full_name} (ID: {timesheet.employee_id})</td>
                  <td>{timesheet.start_time}</td>
                  <td>{timesheet.end_time}</td>
                  <td>{timesheet.summary}</td>
                  <td>
                    <Link to={`/timesheets/${timesheet.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <br />
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
      <hr />
      <button onClick={() => navigate("/timesheets/new")}>Create New Timesheet</button><br />
      <button onClick={() => navigate("/employees")}>View All Employees</button><br />
    </div>
  );
}