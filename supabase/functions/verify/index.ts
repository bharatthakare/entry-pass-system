const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface VerificationResponse {
  valid: boolean;
  student?: {
    id: string;
    name: string;
    class: string;
  };
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('id');
    const signature = url.searchParams.get('sig');

    if (!studentId || !signature) {
      return createErrorResponse('Missing parameters');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('npm:@supabase/supabase-js@latest');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if student exists
    const { data: student, error } = await supabase
      .from('students')
      .select('id, name, class')
      .eq('id', studentId)
      .single();

    if (error || !student) {
      return createErrorResponse('Invalid pass - student not found');
    }

    // Check if pass is revoked
    const { data: revoked } = await supabase
      .from('revoked_passes')
      .select('id')
      .eq('student_id', studentId)
      .single();

    if (revoked) {
      return createErrorResponse('This pass has been revoked');
    }

    // Log verification
    await supabase.from('pass_logs').insert({
      student_id: studentId,
      action_type: 'verified',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
    });

    // Return success HTML page
    return createSuccessResponse(student);

  } catch (error) {
    console.error('Verification error:', error);
    return createErrorResponse('Verification failed');
  }
});

function createSuccessResponse(student: any) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pass Verified ✅</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .card {
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .success-icon {
                width: 80px;
                height: 80px;
                background: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 40px;
            }
            h1 {
                color: #1f2937;
                margin: 0 0 10px;
                font-size: 28px;
            }
            .subtitle {
                color: #6b7280;
                margin-bottom: 30px;
                font-size: 16px;
            }
            .student-info {
                background: #f9fafb;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .label {
                font-weight: 600;
                color: #4b5563;
            }
            .value {
                font-weight: 500;
                color: #1f2937;
            }
            .timestamp {
                color: #9ca3af;
                font-size: 14px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="success-icon">✅</div>
            <h1>Pass Verified!</h1>
            <p class="subtitle">Entry authorized for Annual Event 2025</p>
            
            <div class="student-info">
                <div class="info-row">
                    <span class="label">Student Name:</span>
                    <span class="value">${student.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Class:</span>
                    <span class="value">${student.class}</span>
                </div>
                <div class="info-row">
                    <span class="label">Event Date:</span>
                    <span class="value">30 Sept 2025</span>
                </div>
                <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value" style="color: #10b981;">✅ VERIFIED</span>
                </div>
            </div>
            
            <p class="timestamp">
                Verified on ${new Date().toLocaleString()}
            </p>
        </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      ...corsHeaders,
    },
  });
}

function createErrorResponse(message: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Failed ❌</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .card {
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .error-icon {
                width: 80px;
                height: 80px;
                background: #ef4444;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 40px;
            }
            h1 {
                color: #1f2937;
                margin: 0 0 10px;
                font-size: 28px;
            }
            .error-message {
                color: #6b7280;
                margin-bottom: 30px;
                font-size: 16px;
                line-height: 1.5;
            }
            .warning {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                color: #92400e;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="error-icon">❌</div>
            <h1>Verification Failed</h1>
            <p class="error-message">${message}</p>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This pass could not be verified. Please contact event organizers if you believe this is an error.
            </div>
        </div>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 400,
    headers: {
      'Content-Type': 'text/html',
      ...corsHeaders,
    },
  });
}