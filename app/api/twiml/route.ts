import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Twilio sends form data to this webhook
  const url = new URL(req.url);
  const audioUrl = url.searchParams.get('audioUrl');
  const body = await req.text();
  const params = new URLSearchParams(body);
  
  const answeredBy = params.get('AnsweredBy');

  let twiml = '';

  if (answeredBy === 'machine_start' || answeredBy === 'machine_end_beep' || answeredBy === 'machine_end_silence') {
    // If it's a voicemail, play the audio pitch
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play>${audioUrl}</Play>
      </Response>`;
  } else {
    // If human answers, we just hang up silently to simulate a missed call, 
    // or you could optionally play the message anyway.
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Hangup/>
      </Response>`;
  }

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
