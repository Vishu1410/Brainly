import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const InputCard = ({ onClose, onContentAdd }: { onClose: () => void, onContentAdd : (data : any) => void }) => {
  const cardRef = useRef(null);
  const [type, setType] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    textContent : "",
    file: null as File | null,
  });

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
    data.append("type", type);
  
    if (type === "youtube" || type === "twitter" || type === "text") {
      if (formData.link) data.append("link", formData.link);
    }
  
    if (type === "file" || type === "video" || type === "image") {
      data.append("description", formData.description);
      if (formData.file) {
        data.append("file", formData.file);
      }
    }
  
    if (type === "text" && formData.textContent) {
      data.append("textContent", formData.textContent);
    }

    try {
      
      const res = await axios.post(`${BACKEND_URL}/api/v1/content`, data, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

    
      const newContent = res.data.data;
    
      onContentAdd({
        ...newContent,
        userId : {
          _id : newContent.userId,
          username : newContent.username
        }
      })
      onClose();
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        ref={cardRef}
        className="relative bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4"> Add New Content</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-blue-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {type === "text" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-700">Text Content</label>
              <textarea
                name="textContent"
                value={formData.textContent}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 p-2 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
        )}


        

        {(type === "youtube" || type === "twitter") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-700">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {(type === "file" || type === "video" || type === "image") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-700 capitalize">{type} Upload</label>
            <input
              type="file"
              accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "*"}
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            {formData.file && (
              <p className="text-sm text-gray-500">📎 {formData.file.name}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 p-2 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 rounded-xl shadow-md transition"
        >
          Submit 🚀
        </button>
      </div>
    </div>
  );
};

export default InputCard;
