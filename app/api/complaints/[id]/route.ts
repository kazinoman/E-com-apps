import { NextResponse } from 'next/server';
import { complaints } from '../data';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Complaint not found' }, { status: 404 });
    }
    
    complaints[index] = {
      ...complaints[index],
      ...(body.subject && { subject: body.subject }),
      ...(body.description && { description: body.description }),
      ...(body.status && { status: body.status }),
    };
    
    return NextResponse.json({ success: true, data: complaints[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Complaint not found' }, { status: 404 });
    }
    
    complaints.splice(index, 1);
    
    return NextResponse.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
