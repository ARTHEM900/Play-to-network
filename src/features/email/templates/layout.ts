export function getEmailLayout(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      background-color: #050505;
      color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #050505;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0a0a0a;
      border: 1px solid #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 230, 118, 0.05);
    }
    .header {
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #1a1a1a;
      background: linear-gradient(180deg, rgba(0, 230, 118, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      text-decoration: none;
      text-transform: uppercase;
    }
    .logo-accent {
      color: #00e676;
    }
    .motto {
      font-size: 11px;
      color: #00e676;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-top: 8px;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1a1a1a;
      background-color: #080808;
    }
    .footer-title {
      margin: 0;
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer-text {
      margin: 6px 0 0 0;
      font-size: 11px;
      color: #666666;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ffffff;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #a0a0a0;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .highlight {
      color: #00e676;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #00e676;
      color: #050505 !important;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 14px;
      letter-spacing: 1px;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 0 20px rgba(0, 230, 118, 0.3);
    }
    .info-card {
      background-color: #111111;
      border: 1px solid #222222;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .info-row {
      margin-bottom: 12px;
      font-size: 14px;
      border-bottom: 1px solid #1a1a1a;
      padding-bottom: 12px;
      display: block;
    }
    .info-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }
    .info-label {
      color: #666666;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
      display: block;
      margin-bottom: 4px;
    }
    .info-value {
      color: #ffffff;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">Play To <span class="logo-accent">Network</span></div>
        <div class="motto">Play. Compete. Belong.</div>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p class="footer-title">Play To Network</p>
        <p class="footer-text">This is a transactional email related to your registration on ptn.gg.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
