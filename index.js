https://github.com/ShahdMahmoud9/E-Business-Project
// 1. Bahy: Create Models
// && Save hardcoded student and doctor
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.json());

// Student Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  level: String,
  address: String,
});
const StudentModel = mongoose.model("Student", studentSchema);

// Doctor Schema and Model
const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  major: String,
});
const DoctorModel = mongoose.model("Doctor", doctorSchema);

// Connect to MongoDB
mongoose.connect("mongodb+srv://basmalaa-amr:basmalaamr@project.alxxv9v.mongodb.net/project")
  .then(async () => {
    console.log("DB is connected successfully");

    // Save a student
    const student = new StudentModel({
      name: "Ahmed",
      age: 22,
      phone: "0123456789",
      level: "Freshman",
      address: "Cairo"
    });
    await student.save();
    console.log("Student saved");

    // Save a doctor
    const doctor = new DoctorModel({
      name: "Dr.Mona",
      age: 40,
      phone: "0101010101",
      major: "Cardiology"
    });
    await doctor.save();
    console.log("Doctor saved");

    // Fetch all students
    const students = await StudentModel.find();
    console.log("Students:", students);

    // Fetch all doctors
    const doctors = await DoctorModel.find();
    console.log("Doctors:", doctors);

  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

// 2. Sherry: Add Student (Hardcoded)
server.post("/students/hardcoded", async (req, res) => {
  try {
    const newStudent = new StudentModel({
      name: "matta",
      age: 22,
      level: "Third",
      address: "Cairo",
    });
    await newStudent.save();

    res.status(201).json({
      message: "Student added successfully (hardcoded)",
      student: newStudent,
    });
  } catch (error) {
    res.status(400).send({ message: "Error adding student", error });
  }
});

// 3. Sama: Add Student (from request body)
server.post("/addStudent", async (req, res) => {
  try {
    const newStudent = new StudentModel(req.body);
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (error) {
    res.status(400).send({ message: "Error adding student", error });
  }
});
//4.Basmala Hytham :  Add Doctor (From Query Parameters)
server.post("/addDoctor", async (req, res) => {
  let { name, age, phone, major } = req.query;

  if (!name  !age  !phone || !major) {
    return res.status(400).json({
      message: "Please provide name, age, phone, and major in query parameters",
    });
  }
  try {
    let newDoctor = new DoctorModel({
      name,
      age,
      phone,
      major,
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (err) {
    console.error("Error adding doctor:", err.message);
    res.status(500).send("Failed to add Doctor");
  }
});

// 5. Shahd Mahmoud: Fetch All Students
server.get("/students", async (req, res) => {
  const allStudents = await StudentModel.find();
  res.json(allStudents);
});

// 6.shahd othman : Fetch Both Lists (Students & Doctors)
server.get("/people", async (req, res) => {
  try {
    let allstudents = await StudentModel.find();
    let alldoctors = await DoctorModel.find();
    res.status(200).json({
      students: allstudents,
      doctors: alldoctors,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
});

// 7. Zahwa: Delete a Student by ID or name
server.delete("/deleteStudent", async (req, res) => {
  const { id, name } = req.query;
  try {
let result;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid student ID format");
      }
      result = await StudentModel.findByIdAndDelete(id);
    } else if (name) {
      result = await StudentModel.findOneAndDelete({ name });
    } else {
      return res.status(400).send("Please provide id or name to delete");
    }

    if (!result) {
      return res.status(404).send("Student not found");
    }
    res.send("Student deleted successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// 8. Basmala Amr: Update Doctor’s Name
server.put("/update-doctor", async (req, res) => {
  const { oldName, newName } = req.query;

  if (!oldName || !newName) {
    return res.status(400).send("Please provide both oldName and newName");
  }

  try {
    const doctor = await DoctorModel.findOne({ name: oldName });
    if (!doctor) return res.status(404).send("Doctor not found");

    doctor.name = newName;
    await doctor.save();
    res.send(Doctor name updated to ${newName});
  } catch (err) {
    res.status(500).send("Error updating doctor name");
  }
});

// 9. Endpoint to save hardcoded students to the database
server.post("/saveStudents", async (req, res) => {
    const students = [
        { name: "Ahmed", age: 20, phone: "0101234567", level: "Freshman", address: "Cairo" },
        { name: "Sara", age: 22, phone: "0117654321", level: "Sophomore", address: "Giza" },
        { name: "Omar", age: 21, phone: "0123456789", level: "Junior", address: "Alexandria" }
      ];      

  try {
    await StudentModel.insertMany(students);

    res.status(201).json({ message: "Students added successfully!" });
  } catch (error) {
    res.status(400).send({ message: "Error adding students", error });
  }
});

// Start the server
server.listen(3000, function () {
  console.log("this server now is opened");
});
