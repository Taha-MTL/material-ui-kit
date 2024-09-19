import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const path = `./uploads/${file.name}`;

    // Write the file to the filesystem
    await fs.writeFile(path, Buffer.from(buffer));

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'An error occurred during file upload' }, { status: 500 });
  }
}
