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
