import React, { useState, useRef } from 'react';
import { X, Plus, Image as ImageIcon, Sparkles, Upload, Trash2 } from 'lucide-react';
import { Project, StyleAsset } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Project) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onCreate
}: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('Minimalist');
  const [uploadedImages, setUploadedImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const uniqueId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          setUploadedImages(prev => [
            ...prev,
            {
              id: uniqueId,
              name: file.name.split('.')[0] || 'Uploaded Image',
              url: reader.result
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName) return;

    // Use uploaded images to populate the project's StyleAssets
    const newAssets: StyleAsset[] = uploadedImages.map((img, index) => {
      return {
        id: `custom-asset-${Date.now()}-${index}`,
        title: img.name || `Style Layout ${index + 1}`,
        category: categoryName || 'Concepts',
        imageUrl: img.url,
        loveCount: 0,
        skipCount: 0,
        totalSwipes: 0
      };
    });

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title,
      clientName,
      clientEmail: clientEmail || 'client@example.com',
      description: description || 'No description supplied.',
      status: 'Active',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      team: ['AM', 'JS'],
      assets: newAssets
    };

    onCreate(newProject);
    onClose();

    // Reset clean states
    setTitle('');
    setClientName('');
    setClientEmail('');
    setDescription('');
    setCategoryName('Minimalist');
    setUploadedImages([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-md"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-2xl bg-surface-container border border-outline-variant rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in animate-duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-on-surface">Create New Project</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Establish a new collaborative workspace.</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary">Project Title *</label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Brand Identity - Lumina Labs"
                type="text"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface font-sans text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary">Client Name *</label>
              <input 
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g., Sarah Jenkins"
                type="text"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface font-sans text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary">Client Email Address</label>
            <input 
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              placeholder="client@example.com"
              type="email"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface font-sans text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary">Project Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Briefly describe the project goals, deliverables, and scope..."
              rows={3}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface font-sans text-sm resize-none"
            />
          </div>

          {/* Style Category & Assets Section */}
          <div className="pt-4 border-t border-outline-variant/60 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Style Assets</h3>
              <p className="text-xs text-on-surface-variant font-medium">Create a concept category and load visual directions.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary">Category Name</label>
              <input 
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="e.g., Minimalist Metallic, Retro Synth"
                type="text"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface font-sans text-sm"
              />
            </div>

            {/* Custom Self-Drag and Drop Image Uploader Zone */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-on-surface-variant block">Upload Design Concepts / Images (Drag & drop or Click to choose)</label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`w-full py-8 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary bg-primary/5 scale-[0.99] ring-2 ring-primary/20' 
                    : 'border-outline-variant bg-surface-container-low hover:border-primary hover:bg-surface-container-lowest'
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <div className="p-3 bg-surface-container-high rounded-full text-primary mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-on-surface">Drag and drop your design files here</p>
                <p className="text-xs text-on-surface-variant mt-1.5 font-medium">or click to browse your system folders</p>
                <span className="text-[10px] text-primary mt-2 font-semibold font-mono">Supports: PNG, JPG, JPEG, GIF, WEBP</span>
              </div>

              {/* Grid list of uploaded image attachments */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      Uploaded Images ({uploadedImages.length})
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setUploadedImages([])}
                      className="text-[10px] font-bold text-error hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uploadedImages.map((img) => (
                      <div 
                        key={img.id}
                        className="relative bg-surface-container-low border border-outline-variant rounded-lg p-2 flex flex-col gap-1.5 group hover:border-primary transition-all duration-200"
                      >
                        <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-surface-container-lowest">
                          <img 
                            src={img.url} 
                            alt={img.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(img.id);
                            }}
                            className="absolute top-1 right-1 p-1 bg-error text-on-error rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer z-20"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          value={img.name}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setUploadedImages(prev => prev.map(item => item.id === img.id ? { ...item, name: newName } : item));
                          }}
                          className="w-full bg-surface-container border border-outline-variant/60 rounded px-1.5 py-0.5 text-[10px] text-on-surface font-sans font-medium focus:outline-none focus:border-primary transition-colors"
                          placeholder="Asset Name"
                          title="Click to edit asset name"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-3 sticky bottom-0 bg-surface-container">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!title || !clientName}
              className={`bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-xs transition-all shadow-md shadow-primary/10 select-none ${
                (!title || !clientName) ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-1px] active:scale-95 cursor-pointer'
              }`}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
