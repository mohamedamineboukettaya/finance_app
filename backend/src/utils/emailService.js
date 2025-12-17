import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD // Your email password or app password
  }
});

export const sendBudgetExceededEmail = async (user, budget, currentExpenses) => {
  try {
    const exceededAmount = currentExpenses - budget;
    const percentage = ((currentExpenses / budget) * 100).toFixed(1);

    const mailOptions = {
      from: `"SereniCash Budget Alert" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '⚠️ Budget Limit Exceeded - SereniCash',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stat-item { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
            .amount { font-size: 24px; font-weight: bold; color: #dc3545; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Budget Alert</h1>
              <p>Your monthly spending has exceeded your budget limit</p>
            </div>
            <div class="content">
              <div class="alert-box">
                <h3 style="margin-top: 0; color: #856404;">Budget Limit Exceeded!</h3>
                <p>Hello ${user.name || 'User'},</p>
                <p>You have exceeded your monthly budget limit. Here are the details:</p>
              </div>

              <div class="stats">
                <div class="stat-item">
                  <span><strong>Budget Limit:</strong></span>
                  <span>$${budget.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                  <span><strong>Current Expenses:</strong></span>
                  <span class="amount">$${currentExpenses.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                  <span><strong>Exceeded By:</strong></span>
                  <span style="color: #dc3545; font-weight: bold;">$${exceededAmount.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                  <span><strong>Budget Usage:</strong></span>
                  <span style="color: #dc3545; font-weight: bold;">${percentage}%</span>
                </div>
              </div>

              <p><strong>💡 Recommendation:</strong> Consider reviewing your recent expenses and adjusting your spending to stay within budget.</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/transactions" class="button">
                View Your Transactions
              </a>

              <div class="footer">
                <p>This is an automated alert from SereniCash</p>
                <p>© ${new Date().getFullYear()} SereniCash. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Budget alert email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Failed to send budget alert email:', error);
    return { success: false, error: error.message };
  }
};