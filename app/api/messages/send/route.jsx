import { NextResponse } from 'next/server';
import { saveMessage } from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { recipientId, message, senderId } = await request.json();
    await saveMessage({ recipientId, message, senderId, date: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
  }
}