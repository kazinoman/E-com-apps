export interface Complaint {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

export async function fetchComplaints(): Promise<Complaint[]> {
  const res = await fetch('/api/complaints');
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch complaints');
  }
  return data.data;
}

export async function createComplaint(subject: string, description: string): Promise<Complaint> {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, description }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to create complaint');
  }
  return data.data;
}

export async function updateComplaint(id: string, subject: string, description: string): Promise<Complaint> {
  const res = await fetch(`/api/complaints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, description }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to update complaint');
  }
  return data.data;
}

export async function deleteComplaint(id: string): Promise<void> {
  const res = await fetch(`/api/complaints/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete complaint');
  }
}
