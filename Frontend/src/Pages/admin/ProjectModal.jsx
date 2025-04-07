import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function ProjectModal({ setShowModal, adminId, onProjectAdded }) {
  const [projectName, setProjectName] = useState("");
  const [managers, setManagers] = useState([]);
  const [managerInput, setManagerInput] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [developerInput, setDeveloperInput] = useState("");
  const [testers, setTesters] = useState([]);
  const [testerInput, setTesterInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ added

  const handleAdd = (input, setInput, list, setList) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (item, list, setList) => {
    setList(list.filter((i) => i !== item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newProject = {
      project_name: projectName,
      manager_names: managers,
      developer_names: developers,
      tester_names: testers,
      admin_id: adminId
    };

    console.log("Submitting:", newProject);

    try {
      const res = await fetch("http://localhost:3000/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error("Failed to add project");
      onProjectAdded();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TagList = ({ items, onRemove }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, idx) => (
        <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center">
          {item}
          <IoMdClose
            onClick={() => onRemove(item)}
            className="ml-2 cursor-pointer hover:text-red-500"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Managers Input */}
          <div>
            <label className="block font-medium">Project Manager(s)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={managerInput}
                onChange={(e) => setManagerInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add Manager Name"
              />
              <button
                type="button"
                onClick={() => handleAdd(managerInput, setManagerInput, managers, setManagers)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
            <TagList items={managers} onRemove={(item) => handleRemove(item, managers, setManagers)} />
          </div>

          {/* Developers Input */}
          <div>
            <label className="block font-medium">Developer(s)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={developerInput}
                onChange={(e) => setDeveloperInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add Developer Name"
              />
              <button
                type="button"
                onClick={() => handleAdd(developerInput, setDeveloperInput, developers, setDevelopers)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
            <TagList items={developers} onRemove={(item) => handleRemove(item, developers, setDevelopers)} />
          </div>

          {/* Testers Input */}
          <div>
            <label className="block font-medium">Tester(s)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={testerInput}
                onChange={(e) => setTesterInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add Tester Name"
              />
              <button
                type="button"
                onClick={() => handleAdd(testerInput, setTesterInput, testers, setTesters)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
            <TagList items={testers} onRemove={(item) => handleRemove(item, testers, setTesters)} />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
