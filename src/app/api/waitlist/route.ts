import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the data structure
interface WaitlistEntry {
  name: string;
  email: string;
  timestamp: string;
}

// Path to store the data
const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'waitlist.json');

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Read existing data
    let entries: WaitlistEntry[] = [];
    if (existsSync(dataFile)) {
      const fileContent = await readFile(dataFile, 'utf-8');
      entries = JSON.parse(fileContent);
    }

    // Check if email already exists
    const existingEntry = entries.find(entry => entry.email.toLowerCase() === email.toLowerCase());
    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Add new entry
    const newEntry: WaitlistEntry = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      timestamp: new Date().toISOString()
    };

    entries.push(newEntry);

    // Save to file
    await writeFile(dataFile, JSON.stringify(entries, null, 2));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist!',
        entry: newEntry
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!existsSync(dataFile)) {
      return NextResponse.json({ entries: [] });
    }

    const fileContent = await readFile(dataFile, 'utf-8');
    const entries: WaitlistEntry[] = JSON.parse(fileContent);

    return NextResponse.json({ 
      entries,
      count: entries.length
    });

  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 