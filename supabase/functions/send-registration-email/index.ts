import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  email: string;
  fullName: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, role }: RegistrationEmailRequest = await req.json();

    console.log("Sending registration email to:", email);

    const emailResponse = await resend.emails.send({
      from: "DonorCompass <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to DonorCompass - Registration Confirmed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">❤️ Welcome to DonorCompass</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Blood Bank Management System</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Thank you for registering with DonorCompass as a <strong>${role}</strong>. 
              Your account has been successfully created and is ready to use.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #dc2626;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${role === 'donor' ? `
                  <li>Complete your donor profile with health information</li>
                  <li>Schedule your first donation appointment</li>
                  <li>Learn about donation eligibility requirements</li>
                ` : ''}
                ${role === 'hospital' ? `
                  <li>Set up your hospital's blood request preferences</li>
                  <li>Access real-time blood inventory levels</li>
                  <li>Submit and track blood requests</li>
                ` : ''}
                ${role === 'patient' ? `
                  <li>Complete your medical profile</li>
                  <li>Submit blood requests when needed</li>
                  <li>Track your request status</li>
                ` : ''}
                <li>Explore the dashboard to familiarize yourself with features</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SITE_URL") || "http://localhost:8080"}" 
                 style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
              <p><strong>Need Help?</strong></p>
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Thank you for being part of our life-saving mission!</p>
              <p style="margin-top: 20px;"><strong>The DonorCompass Team</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Registration email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending registration email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);