import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';

const CreateChapterModal = ({ isOpen, onClose, onSubmit, storyTitle, nextChapterNumber }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Chapter title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Chapter content is required');
      return;
    }

    if (formData.title.trim().length < 3) {
      toast.error('Chapter title must be at least 3 characters long');
      return;
    }

    if (formData.content.trim().length < 10) {
      toast.error('Chapter content must be at least 10 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      handleClose();
    } catch (err) {
      console.error('Error submitting chapter:', err);
      toast.error('Failed to create chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', content: '' });
    setIsSubmitting(false);
    onClose();
  };

  const wordCount = formData.content ? formData.content.trim().split(/\s+/).filter(word => word.length > 0).length : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Chapter</h2>
            <p className="text-sm text-gray-500 mt-1">
              Chapter {nextChapterNumber} for "{storyTitle}"
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Chapter Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter chapter title..."
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          {/* Chapter Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Chapter Content <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">
                {wordCount} words
              </span>
            </div>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Start writing your chapter here..."
              disabled={isSubmitting}
              rows={12}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-500">
              Write the content for this chapter. Minimum 10 characters required.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" size={16} />
                Create Chapter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChapterModal;