import React, { useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
const CreateStoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    coverImage: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "mystery", label: "Mystery" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "thriller", label: "Thriller" },
    { value: "adventure", label: "Adventure" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "comedy", label: "Comedy" },
    { value: "historical", label: "Historical Fiction" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a story title.");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Please enter a story description.");
      return;
    }
    
    if (!formData.genre) {
      toast.error("Please select a genre.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        genre: "",
        coverImage: ""
      });
      onClose();
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        genre: "",
        coverImage: ""
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={cn(
        "bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto",
        "transform transition-all duration-300 scale-100"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
              <ApperIcon name="Plus" size={16} className="text-white" />
            </div>
            Create New Story
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            name="title"
            label="Story Title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your story title..."
            required
            disabled={isSubmitting}
          />

          <Textarea
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your story..."
            rows={4}
            required
            disabled={isSubmitting}
          />

          <Select
            name="genre"
            label="Genre"
            value={formData.genre}
            onChange={handleInputChange}
            options={genres}
            placeholder="Select a genre..."
            required
            disabled={isSubmitting}
          />

          <Input
            name="coverImage"
            label="Cover Image URL"
            value={formData.coverImage}
            onChange={handleInputChange}
            placeholder="https://example.com/cover.jpg"
            disabled={isSubmitting}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!formData.title.trim() || !formData.description.trim() || !formData.genre}
              className="flex-1"
            >
              Create Story
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;