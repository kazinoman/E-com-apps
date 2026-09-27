import { NextResponse } from 'next/server';
import { complaints } from './data';

export async function GET() {
  return NextResponse.json({ success: true, data: complaints });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.subject || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Subject and description are required' },
        { status: 400 }
      );
    }
    
    const newComplaint = {
      id: Math.random().toString(36).substring(2, 9),
      subject: body.subject,
      description: body.description,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    
    complaints.unshift(newComplaint);
    
    return NextResponse.json({ success: true, data: newComplaint }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
