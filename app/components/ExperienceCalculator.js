"use client";
import React, { useState, useEffect } from "react";

export default function ExperienceCalculator() {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    joinDate: "",
    leaveDate: "",
  });
  const [experiences, setExperiences] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const storedExperiences =
      JSON.parse(localStorage.getItem("experiences")) || [];
    setExperiences(storedExperiences);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addOrUpdateExperience = () => {
    const { companyName, position, joinDate, leaveDate } = formData;

    if (!companyName || !position || !joinDate) {
      alert("Please provide company name, position, and joining date.");
      return;
    }

    const startDate = new Date(joinDate);
    const endDate = leaveDate ? new Date(leaveDate) : new Date();

    if (startDate > endDate) {
      alert("Joining date cannot be after leaving date.");
      return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    const newExperience = {
      id: Date.now(),
      companyName,
      position,
      joinDate,
      leaveDate: leaveDate || "Present",
      totalExperienceincompany: { years, months, days },
    };

    const updatedExperiences = editingId
      ? experiences.map((exp) => (exp.id === editingId ? newExperience : exp))
      : [...experiences, newExperience];

    setExperiences(updatedExperiences);
    localStorage.setItem("experiences", JSON.stringify(updatedExperiences));

    // Reset form and editingId
    setFormData({ companyName: "", position: "", joinDate: "", leaveDate: "" });
    setEditingId(null); // Reset editingId after saving
  };

  const calculateTotalExperience = () => {
    const total = experiences.reduce(
      (acc, exp) => {
        acc.years += exp.totalExperienceincompany.years;
        acc.months += exp.totalExperienceincompany.months;
        acc.days += exp.totalExperienceincompany.days;
        return acc;
      },
      { years: 0, months: 0, days: 0 }
    );

    total.months += Math.floor(total.days / 30);
    total.days = total.days % 30;
    total.years += Math.floor(total.months / 12);
    total.months = total.months % 12;

    return total;
  };

  const totalExperience = calculateTotalExperience();

  const editExperience = (id) => {
    const experienceToEdit = experiences.find((exp) => exp.id === id);
    if (experienceToEdit) {
      setFormData({
        companyName: experienceToEdit.companyName,
        position: experienceToEdit.position,
        joinDate: experienceToEdit.joinDate,
        leaveDate: experienceToEdit.leaveDate,
      });
      setEditingId(id);
    }
  };

  const deleteExperience = (id) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    localStorage.setItem("experiences", JSON.stringify(updatedExperiences));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-gray-800  font-medium text-center mb-4">
        Add Experience
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 focus:outline-gray-300 focus:border-gray-300"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 focus:outline-gray-300 focus:border-gray-300"
        />
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 focus:outline-gray-300 focus:border-gray-300"
        />
        <input
          type="date"
          name="leaveDate"
          value={formData.leaveDate}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 focus:outline-gray-300 focus:border-gray-300"
        />
      </div>
      <div class="flex justify-center items-center">
        <button
          onClick={addOrUpdateExperience}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Experience
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <h3 className="text-2xl text-gray-800 font-medium text-center my-4">
          Experience List
        </h3>
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="border border-gray-300 p-2">Company Name</th>
              <th className="border border-gray-300 p-2">Job Role</th>
              <th className="border border-gray-300 p-2">Date Of Joining</th>
              <th className="border border-gray-300 p-2">Till</th>
              <th className="border border-gray-300 p-2">
                Total Experience in this company
              </th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm font-light">
            {experiences.map((exp, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 font-bold">
                  {exp.companyName}
                </td>
                <td className="border border-gray-300 p-2">{exp.position}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(exp.joinDate).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="border border-gray-300 p-2">
                  {exp.leaveDate === "Present"
                    ? exp.leaveDate
                    : new Date(exp.leaveDate).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                </td>
                <td className="border border-gray-300 p-2">
                  {exp.totalExperienceincompany.years > 0
                    ? `${exp.totalExperienceincompany.years} years, ${exp.totalExperienceincompany.months} months, and ${exp.totalExperienceincompany.days} days`
                    : `${exp.totalExperienceincompany.months} months, and ${exp.totalExperienceincompany.days} days`}
                </td>
                <td className="border border-gray-300 p-2 flex space-x-3">
                  <button
                    onClick={() => {
                      editExperience(exp.id);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {experiences.length > 0 && (
          <>
            <h3 className="text-2xl text-gray-800  font-medium text-center my-4">
              Total Experience Overall:
            </h3>
            <p className="text-center">
              {totalExperience.years > 0
                ? `${totalExperience.years} years, ${totalExperience.months} months, and ${totalExperience.days} days`
                : `${totalExperience.months} months, and ${totalExperience.days} days`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
