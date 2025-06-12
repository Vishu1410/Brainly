import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const InputCard = ({ onClose }: { onClose: () => void }) => {
  const cardRef = useRef(null);
  const [type, setType] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    file: null as File | null,
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !(cardRef.current as any).contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", type);
    if (type === "youtube" || type === "twitter") {
      data.append("link", formData.link);
    }
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const res = await axios.post(BACKEND_URL+"/api/v1/content",data,{
        headers:{
          Authorization : localStorage.getItem("token")
        }
      })

      // const result = await res.json();
      console.log("Submitted:", res);
      onClose(); // close after submission
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        ref={cardRef}
        className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X />
        </button>

        <h2 className="text-xl font-semibold">Add Content</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="text">Text</option>
            <option value="file">File</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {(type === "youtube" || type === "twitter") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        )}

        {(type === "file" || type === "video" || type === "image") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium capitalize">{type} Upload</label>
            <input
              type="file"
              accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "*"}
              onChange={handleFileChange}
              className="w-full"
            />
            {formData.file && (
              <p className="text-sm text-gray-600">Selected: {formData.file.name}</p>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default InputCard;
