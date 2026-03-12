import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { twilioSid, twilioAuth, twilioPhone, audioUrl, leads } = await req.json();

    if (!twilioSid || !twilioAuth || !twilioPhone || !audioUrl || !leads || leads.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = twilio(twilioSid, twilioAuth);

    const calls = [];
    const errors = [];

    // Base URL of the SaaS to handle the Twilio webhook
    // Usually this needs to be a public URL like an ngrok URL or the VPS IP
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https'; // Use HTTPS in prod
    const webhookUrl = `http://${host}/api/twiml?audioUrl=${encodeURIComponent(audioUrl)}`;

    for (const lead of leads) {
      const phone = lead.Phone || lead['Phone Number'] || lead.phone;
      if (!phone) continue;

      try {
        const call = await client.calls.create({
          to: phone,
          from: twilioPhone,
          machineDetection: 'Enable',
          machineDetectionTimeout: 15,
          asyncAmd: 'true',
          asyncAmdStatusCallback: webhookUrl,
          url: webhookUrl, // Fallback if human answers (we can hangup or play message)
        });
        calls.push({ phone, callSid: call.sid });
      } catch (e: any) {
        errors.push({ phone, error: e.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Initiated ${calls.length} calls.`,
      calls,
      errors 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
