// src/templates/email-template.ts
export const emailTemplateResetPassword = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        /* General styles */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #007BFF;
            color: white;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            color: #333333;
        }

        .content p {
            color: #666666;
            line-height: 1.6;
        }

        .content a {
            color:white;
            text-decoration: none;
        }

        .button {
            display: block;
            width: fit-content;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #007BFF;
            text-decoration: none; /* Bỏ gạch chân */
            font-size: 16px; /* Kích thước chữ */
        }

        .footer {
            text-align: center;
            padding: 10px;
            color: #999999;
            font-size: 12px;
        }

        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>[EMAIL_SUBJECT]</h1>
        </div>
        <div class="content">
            <h2>Hello [USER_NAME],</h2>
            <p>[EMAIL_BODY]</p>
            <a href="[VERIFICATION_LINK]" class="button">Verify Email</a>
            <p>If the button above does not work, you can copy and paste the following link into your browser:</p>
            <p><a href="[VERIFICATION_LINK]">[VERIFICATION_LINK]</a></p>
            <p>If you have any questions or need assistance, feel free to reply to this email.</p>
            <p>Best Regards,<br>The [COMPANY_NAME] Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 [COMPANY_NAME]. All rights reserved.</p>
            <p><a href="[UNSUBSCRIBE_LINK]">Unsubscribe</a> from these emails.</p>
        </div>
    </div>
</body>

</html>
`;
