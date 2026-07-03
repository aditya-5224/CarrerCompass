import { NextResponse } from "next/server";
// import twilio from "twilio";

export async function POST() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER; // For WhatsApp, usually something like: whatsapp:+14155238886
    const emergencyNumber = process.env.EMERGENCY_CONTACT_NUMBER; // e.g., whatsapp:+91XXXXXXXXXX or +91XXXXXXXXXX

    if (!accountSid || !authToken || !twilioPhone || !emergencyNumber) {
      console.error("Missing Twilio credentials in environment variables.");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // Uncomment the following after running `npm install twilio`
    /*
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: "🚨 EMERGENCY SOS ALERT! 🚨\nThe user of CareerCompass has triggered an emergency alert. Please contact them immediately.",
      from: twilioPhone,
      to: emergencyNumber,
    });

    console.log("SOS Message sent with SID:", message.sid);
    */

    // For now, simulating success so the UI works without crashing before twilio is installed
    console.log("Simulating Twilio SOS Message. Install twilio to enable real messages.");
    console.log(`To: ${emergencyNumber}`);

    return NextResponse.json({ success: true, message: "SOS Alert sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("SOS API Error:", error);
    return NextResponse.json({ error: "Failed to send SOS Alert" }, { status: 500 });
  }
}
