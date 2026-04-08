"use server"
import { escapeHtml } from './escapeHtml';
import type { ContactFormData } from '@/app/contacte/types/form.types';
import { getServiceLabel } from './getServiceLabel';
import { getServiceDescription } from '@/app/contacte/lib/serviceLabels';
import { siteConfig } from '@/app/_lib/siteConfig';

export const buildConfirmationEmail = async (data: ContactFormData): Promise<string> => {
  const colors = {
    shakespeare: '#6b8ac6',
    scampi: '#676799',
    jacarta: '#4B3D66',
    lilac: '#fffaf6',
    midnight: '#212322',
  };

  const serviceLabel = getServiceLabel(data.serviceType);
  const detailedServiceDescription = getServiceDescription(
    data.serviceType,
    data.externsSubtype as any,
    data.centreSubtype as any,
    data.entityType as any,
    data.entityName
  );

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmació de rebuda - Taller dels Sentits</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: ${colors.midnight};
      background-color: ${colors.lilac};
    }

    .email-wrapper {
      background-color: ${colors.lilac};
      padding: 40px 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .email-header {
      background: linear-gradient(135deg, ${colors.shakespeare} 0%, ${colors.scampi} 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }

    .email-header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 300;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .email-header p {
      font-size: 14px;
      opacity: 0.9;
    }

    .email-body {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 16px;
      margin-bottom: 24px;
      line-height: 1.8;
    }

    .greeting strong {
      color: ${colors.shakespeare};
    }

    .service-box {
      background-color: ${colors.lilac};
      border-left: 4px solid ${colors.shakespeare};
      padding: 20px;
      margin: 24px 0;
      border-radius: 4px;
      font-size: 15px;
    }

    .service-box p {
      margin: 0;
      color: ${colors.midnight};
    }

    .service-label {
      font-weight: 500;
      color: ${colors.jacarta};
      margin-bottom: 8px;
    }

    .message {
      font-size: 15px;
      line-height: 1.8;
      margin: 24px 0;
      color: ${colors.midnight};
    }

    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid ${colors.lilac};
      font-size: 14px;
      color: ${colors.scampi};
    }

    .signature-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px;
      color: ${colors.shakespeare};
      margin-bottom: 4px;
    }

    @media (max-width: 480px) {
      .email-container {
        border-radius: 0;
      }

      .email-body {
        padding: 24px 16px;
      }

      .email-header h1 {
        font-size: 22px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1>Confirmació de rebuda</h1>
        <p>${escapeHtml(siteConfig.businessName)}</p>
      </div>

      <!-- Body -->
      <div class="email-body">
        <div class="greeting">
          Hola <strong>${escapeHtml(data.name)}</strong>,
        </div>

        <div class="message">
          Hem rebut correctament la teva consulta sobre <strong>${escapeHtml(serviceLabel)}</strong>.
        </div>

        <div class="service-box">
          <p class="service-label">Tipus de consulta:</p>
          <p>${escapeHtml(detailedServiceDescription)}</p>
        </div>

        <div class="message">
          Et respondrem el més aviat possible. Si necessites contactar amb nosaltres urgentment, pots enviar-nos un missatge al <strong>${escapeHtml(siteConfig.contactPhone)}</strong> o escriure'ns a <strong>${escapeHtml(siteConfig.contactEmail)}</strong>.
        </div>

        <div class="signature">
          <div class="signature-name">${escapeHtml(siteConfig.businessName)}</div>
          <p style="margin: 0; font-size: 13px;">Artteràpia i acompanyament creatiu</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};
