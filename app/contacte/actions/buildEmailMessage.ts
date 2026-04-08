"use server"
import { escapeHtml } from './escapeHtml';
import type { ContactFormData } from '@/app/contacte/types/form.types';
import { getCentreSubtypeLabel, getEntityTypeLabel, getServiceDescription } from '@/app/contacte/lib/serviceLabels';
import { siteConfig } from '@/app/_lib/siteConfig';

export const buildEmailMessage = async (data: ContactFormData): Promise<string> => {
  const availabilityLabels = {
    morning: 'Matins (9h-14h)',
    afternoon: 'Tardes (14h-18h)',
    anytime: 'Qualsevol moment'
  };

  const arttherapyLabels: Record<string, string> = {
    individual: 'Sessions individuals',
    grupal: 'Sessions grupals',
    unsure: 'No estic segur/a'
  };

  const ageLabels: Record<string, string> = {
    adolescent: 'Adolescents (12-15 anys)',
    'young-adult': 'Joves (15-20 anys)',
    adult: 'Adults (20 anys o més)'
  };

  const educationStageLabels: Record<string, string> = {
    infantil: 'Infantil',
    primaria: 'Primària',
    eso: 'ESO',
    batxillerat: 'Batxillerat'
  };

  const entityLabels: Record<string, string> = {
    ajuntament: 'Ajuntament',
    hospital: 'Hospital',
    residencia: 'Residència',
    'centre-cultural': 'Centre Cultural',
    'col-lectiu-empresa': 'Col·lectiu d\'empresa',
    'entitat-social': 'Entitat Social',
    altres: 'Altres'
  };

  // Color palette from globals.css
  const colors = {
    shakespeare: '#6b8ac6',
    scampi: '#676799',
    jacarta: '#4B3D66',
    'violet-blue': '#945696',
    midnight: '#212322',
    lilac: '#fffaf6',
  };

  let html = `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nova consulta - Taller dels Sentits</title>
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

    .message-box {
      background-color: ${colors.lilac};
      border-left: 4px solid ${colors.shakespeare};
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 4px;
      font-size: 15px;
      line-height: 1.7;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 400;
      color: ${colors.shakespeare};
      border-bottom: 2px solid ${colors.lilac};
      padding-bottom: 12px;
      margin-bottom: 16px;
      letter-spacing: 0.03em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .field {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .field-label {
      font-weight: 500;
      color: ${colors.jacarta};
      min-width: 150px;
    }

    .field-value {
      color: ${colors.midnight};
      flex: 1;
      text-align: right;
    }

    @media (max-width: 480px) {
      .email-container {
        border-radius: 0;
      }

      .email-body {
        padding: 24px 16px;
      }

      .field {
        flex-direction: column;
      }

      .field-value {
        text-align: left;
      }

      .email-header h1 {
        font-size: 22px;
      }
    }

    .emoji {
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1>Nova Consulta</h1>
        <p>${escapeHtml(siteConfig.businessName)}</p>
      </div>

      <!-- Body -->
      <div class="email-body">
        <!-- Message -->
        <div class="message-box">
          ${escapeHtml(data.message)}
        </div>

        <!-- Contact Information Section -->
        <div class="section">
          <div class="section-title">
            <span class="emoji">📋</span>
            Informació de Contacte
          </div>
          <div class="field">
            <span class="field-label">Nom:</span>
            <span class="field-value">${escapeHtml(data.name)}</span>
          </div>
          <div class="field">
            <span class="field-label">Email:</span>
            <span class="field-value"><a href="mailto:${escapeHtml(data.email)}" style="color: ${colors.shakespeare}; text-decoration: none;">${escapeHtml(data.email)}</a></span>
          </div>
          ${data.phone ? `
          <div class="field">
            <span class="field-label">Telèfon:</span>
            <span class="field-value">${escapeHtml(data.phone)}</span>
          </div>
          ` : ''}
          ${data.location ? `
          <div class="field">
            <span class="field-label">Població:</span>
            <span class="field-value">${escapeHtml(data.location)}</span>
          </div>
          ` : ''}
        </div>

        <!-- Contact Preferences -->
        ${data.contactPreference.length > 0 ? `
        <div class="section">
          <div class="section-title">
            <span class="emoji">📞</span>
            Preferència de Contacte
          </div>
          <div class="field">
            <span class="field-label">Mitjà preferit:</span>
            <span class="field-value">${data.contactPreference.map(escapeHtml).join(', ')}</span>
          </div>
          ${data.availability ? `
          <div class="field">
            <span class="field-label">Disponibilitat:</span>
            <span class="field-value">${availabilityLabels[data.availability] ?? escapeHtml(String(data.availability))}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <!-- Service Details -->
        ${data.serviceType === 'artterapia' ? `
        <div class="section">
          <div class="section-title">
            <span class="emoji">🎨</span>
            Artteràpia
          </div>
          ${data.arttherapyFormat ? `
          <div class="field">
            <span class="field-label">Format:</span>
            <span class="field-value">${arttherapyLabels[data.arttherapyFormat] ?? escapeHtml(String(data.arttherapyFormat))}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${data.serviceType === 'artperdins' ? `
        <div class="section">
          <div class="section-title">
            <span class="emoji">🌸</span>
            Artperdins
          </div>
          ${data.participantAge ? `
          <div class="field">
            <span class="field-label">Edat participant:</span>
            <span class="field-value">${ageLabels[data.participantAge] ?? escapeHtml(String(data.participantAge))}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${data.serviceType === 'serveis-externs' ? `
        <div class="section">
          <div class="section-title">
            <span class="emoji">🏛️</span>
            Serveis Externs
          </div>

          ${data.externsSubtype === 'centre-educatiu' ? `
          <div class="field">
            <span class="field-label">Tipus de servei:</span>
            <span class="field-value">Centre Educatiu - ${getCentreSubtypeLabel(data.centreSubtype as any)}</span>
          </div>

          ${data.centreSubtype === 'alumnes' ? `
          <div class="field">
            <span class="field-label">Destinatari:</span>
            <span class="field-value">Formació per a alumnes</span>
          </div>
          ${data.schoolName ? `
          <div class="field">
            <span class="field-label">Nom del centre:</span>
            <span class="field-value">${escapeHtml(data.schoolName)}</span>
          </div>
          ` : ''}
          ${data.educationStage ? `
          <div class="field">
            <span class="field-label">Etapa:</span>
            <span class="field-value">${educationStageLabels[data.educationStage] ?? escapeHtml(String(data.educationStage))}</span>
          </div>
          ` : ''}
          ${data.courseGroup ? `
          <div class="field">
            <span class="field-label">Curs:</span>
            <span class="field-value">${escapeHtml(data.courseGroup)}</span>
          </div>
          ` : ''}
          ${data.studentsCount ? `
          <div class="field">
            <span class="field-label">Nombre d'alumnes:</span>
            <span class="field-value">~${data.studentsCount}</span>
          </div>
          ` : ''}
          ${data.courseInterest ? `
          <div class="field">
            <span class="field-label">Interès:</span>
            <span class="field-value">${escapeHtml(data.courseInterest)}</span>
          </div>
          ` : ''}
          ` : ''}

          ${data.centreSubtype === 'professorat' ? `
          <div class="field">
            <span class="field-label">Destinatari:</span>
            <span class="field-value">Formació al profesorat</span>
          </div>
          ${data.schoolName ? `
          <div class="field">
            <span class="field-label">Nom del centre:</span>
            <span class="field-value">${escapeHtml(data.schoolName)}</span>
          </div>
          ` : ''}
          ${data.educationStage ? `
          <div class="field">
            <span class="field-label">Etapa:</span>
            <span class="field-value">${educationStageLabels[data.educationStage] ?? escapeHtml(String(data.educationStage))}</span>
          </div>
          ` : ''}
          ${data.teachersCount ? `
          <div class="field">
            <span class="field-label">Nombre de professors:</span>
            <span class="field-value">~${data.teachersCount}</span>
          </div>
          ` : ''}
          ${data.trainingInterest ? `
          <div class="field">
            <span class="field-label">Àrea d'interès:</span>
            <span class="field-value">${escapeHtml(data.trainingInterest)}</span>
          </div>
          ` : ''}
          ` : ''}
          ` : ''}

          ${data.externsSubtype === 'altres-entitats' ? `
          <div class="field">
            <span class="field-label">Tipus de servei:</span>
            <span class="field-value">${escapeHtml(getServiceDescription(data.serviceType, data.externsSubtype as any, undefined, data.entityType as any, data.entityName))}</span>
          </div>
          ${data.entityType ? `
          <div class="field">
            <span class="field-label">Tipus d'entitat:</span>
            <span class="field-value">${entityLabels[data.entityType] ?? escapeHtml(String(data.entityType))}</span>
          </div>
          ` : ''}
          ${data.entityName ? `
          <div class="field">
            <span class="field-label">Nom entitat:</span>
            <span class="field-value">${escapeHtml(data.entityName)}</span>
          </div>
          ` : ''}
          ${data.entityType === 'altres' && data.entityDescription ? `
          <div class="field">
            <span class="field-label">Descripció:</span>
            <span class="field-value">${escapeHtml(data.entityDescription)}</span>
          </div>
          ` : ''}
          ${data.participantsCount ? `
          <div class="field">
            <span class="field-label">Nombre de participants:</span>
            <span class="field-value">~${data.participantsCount}</span>
          </div>
          ` : ''}
          ${data.projectDescription ? `
          <div class="field">
            <span class="field-label">Descripció del projecte:</span>
            <span class="field-value">${escapeHtml(data.projectDescription)}</span>
          </div>
          ` : ''}
          ` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
};
