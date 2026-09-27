"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Trash2, Edit2, Clock, CheckCircle } from "lucide-react";
import { fetchComplaints, createComplaint, updateComplaint, deleteComplaint, Complaint } from "@/services/complaints.service";

export default function ComplainPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setFormLoading(true);
      if (editingId) {
        await updateComplaint(editingId, subject, description);
      } else {
        await createComplaint(subject, description);
      }
      
      await loadComplaints();
      closeForm();
    } catch (error) {
      console.error("Failed to save complaint", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      await deleteComplaint(id);
      await loadComplaints();
    } catch (error) {
      console.error("Failed to delete complaint", error);
    }
  };

  const handleEdit = (complaint: Complaint) => {
    setSubject(complaint.subject);
    setDescription(complaint.description);
    setEditingId(complaint.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setSubject("");
    setDescription("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F05C22]"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">My Complaints</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Manage and track your support requests</p>
        </div>
        
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-[#1C244B] dark:bg-white text-white dark:text-[#1C244B] px-4 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[#1C244B]/90 transition-colors"
          >
            <Plus size={18} />
            New Complaint
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-background rounded-xl p-6 border border-border mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {editingId ? "Edit Complaint" : "File a New Complaint"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly describe the issue..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-[#F05C22] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide as much detail as possible..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-[#F05C22] transition-colors resize-none"
                required
              ></textarea>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-[#F05C22] hover:bg-[#e0521c] text-white px-6 py-2.5 rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-70"
              >
                {formLoading ? "Saving..." : "Submit Complaint"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={formLoading}
                className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No complaints found</h3>
          <p className="text-[14px] text-muted-foreground mt-2 max-w-md mx-auto">
            You don't have any open complaints. If you need assistance with anything, feel free to file one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-background border border-border rounded-xl p-5 md:p-6 transition-all hover:border-[#F05C22]/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base md:text-lg font-bold text-foreground">{complaint.subject}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
                      complaint.status === 'Resolved' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {complaint.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-[14px] text-muted-foreground mb-4">
                    {complaint.description}
                  </p>
                  <div className="text-[12px] text-[#8C93A3] flex items-center gap-1.5">
                    Filed on {formatDate(complaint.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t border-border md:border-none">
                  <button 
                    onClick={() => handleEdit(complaint)}
                    className="p-2 text-muted-foreground hover:text-[#1C244B] dark:hover:text-white bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(complaint.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 bg-muted hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
