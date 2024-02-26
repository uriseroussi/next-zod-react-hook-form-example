import { NextRequest, NextResponse } from 'next/server';
import { formSchema } from '@/schemas/schema';

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const data: { [key: string]: any } = {};

  formData.forEach((value, key) => (data[key] = value));

  const parsed = formSchema.safeParse(data);

  if (parsed.success) {
    const parsedData = parsed.data;
    console.log(parsedData);

    return NextResponse.json(
      { message: 'data validation and parsing success' },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: 'data validation and parsing failed' },
    { status: 500 }
  );
}
