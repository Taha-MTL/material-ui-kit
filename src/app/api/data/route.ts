// app/api/data/route.ts
import { NextResponse } from 'next/server';

// Simulated dataset for demonstration
interface Item {
  id: number;
  name: string;
}

const dataset: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  // Calculate total pages
  const totalPages = Math.ceil(dataset.length / limit);

  // Get paginated data
  const start = (page - 1) * limit;
  const data = dataset.slice(start, start + limit);

  return NextResponse.json({
    page,
    limit,
    totalPages,
    data,
  });
}
