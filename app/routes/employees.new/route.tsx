import { Form, redirect, useNavigate, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { useState, useEffect } from "react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");

  const db = await getDB();
  await db.run(
    `INSERT INTO employees (
      full_name, email, phone_number, date_of_birth,
      job_title, department, salary, start_date, end_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date]
  );

  return redirect("/employees");
}

export default function NewEmployeePage() {
  const [formData, setFormData] = useState({
    date_of_birth: "",
    salary: "",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState({
    age: "",
    salary: "",
    dates: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const validateForm = () => {
      const newErrors = { age: "", salary: "", dates: "" };

      if (formData.date_of_birth) {
        const dob = new Date(formData.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        
        if (
          age < 18 ||
          (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
        ) {
          newErrors.age = "Employee must be at least 18 years old";
        }
      }

      if (formData.salary && Number(formData.salary) < 1000) {
        newErrors.salary = "Salary must be at least $31,200";
      }

      if (formData.start_date && formData.end_date) {
        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        if (end < start) {
          newErrors.dates = "End date cannot be before start date";
        }
      }

      setErrors(newErrors);
    };

    validateForm();
  }, [formData]);

  const isFormValid = !errors.age && !errors.salary && !errors.dates;
  const navigate = useNavigate();
  return (
    <div>
      <h1>Create New Employee</h1>
      <Form method="post">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input type="tel" name="phone_number" id="phone_number" required />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            required
            onChange={handleInputChange}
            value={formData.date_of_birth}
          />
          {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" required />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            name="salary"
            id="salary"
            step="0.01"
            min="0"
            required
            onChange={handleInputChange}
            value={formData.salary}
          />
          {errors.salary && <p style={{ color: "red" }}>{errors.salary}</p>}
        </div>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            required
            onChange={handleInputChange}
            value={formData.start_date}
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            required
            onChange={handleInputChange}
            value={formData.end_date}
          />
          {errors.dates && <p style={{ color: "red" }}>{errors.dates}</p>}
        </div>
        <button type="submit" disabled={!isFormValid}>
          Create Employee
        </button>
      </Form>
      <hr />
      <button onClick={() => navigate("/employees")}>See Employees</button><br/>
      <button onClick={() => navigate("/timesheets")}>See Timesheets</button><br/>
    </div>
  );
}