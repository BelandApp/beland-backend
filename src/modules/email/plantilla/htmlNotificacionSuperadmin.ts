export type SuperadminNotificationType =
  | 'PURCHASE'
  | 'TRANSFER_RECHARGE'
  | 'WITHDRAWAL_REQUEST';

export interface SuperadminNotificationTemplateData {
  type: SuperadminNotificationType;
  amount: number | string;
  currency?: string;
  userName?: string;
  userEmail?: string;
  operationId?: string;
  reference?: string;
  status?: string;
  paymentMethod?: string;
  description?: string;
  createdAt?: Date | string;
  adminUrl?: string;
  details?: Record<string, string | number | boolean | null | undefined>;
}

const notificationMeta: Record<
  SuperadminNotificationType,
  { title: string; badge: string; intro: string; color: string; background: string }
> = {
  PURCHASE: {
    title: 'Nueva compra registrada',
    badge: 'Compra',
    intro: 'Se registro una nueva compra en Beland.',
    color: '#21c97a',
    background: '#f0fdf6',
  },
  TRANSFER_RECHARGE: {
    title: 'Nueva recarga por transferencia',
    badge: 'Recarga',
    intro: 'Un usuario cargo una solicitud de recarga por transferencia.',
    color: '#ff7a18',
    background: '#fff7ed',
  },
  WITHDRAWAL_REQUEST: {
    title: 'Nueva solicitud de retiro',
    badge: 'Retiro',
    intro: 'Un usuario solicito retirar dinero de su billetera.',
    color: '#2563eb',
    background: '#eff6ff',
  },
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatAmount = (amount: number | string, currency = 'USD'): string => {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount);

  if (Number.isFinite(numericAmount)) {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(numericAmount);
  }

  return `${escapeHtml(currency)} ${escapeHtml(amount)}`;
};

const formatDate = (date?: Date | string): string => {
  const parsedDate = date ? new Date(date) : new Date();

  if (Number.isNaN(parsedDate.getTime())) {
    return escapeHtml(date);
  }

  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
};

const renderRow = (label: string, value?: string | number | boolean | null): string => {
  if (value === undefined || value === null || value === '') return '';

  return `
    <tr>
      <td style="padding:10px 0; font-size:14px; color:#667085; border-bottom:1px solid #eef2f7;">${escapeHtml(label)}</td>
      <td align="right" style="padding:10px 0; font-size:14px; font-weight:600; color:#344054; border-bottom:1px solid #eef2f7;">${escapeHtml(value)}</td>
    </tr>
  `;
};

const renderDetails = (
  details?: Record<string, string | number | boolean | null | undefined>,
): string => {
  if (!details) return '';

  return Object.entries(details)
    .map(([label, value]) => renderRow(label, value))
    .join('');
};

export function superadminNotificationEmailTemplate(
  data: SuperadminNotificationTemplateData,
): string {
  const meta = notificationMeta[data.type];
  const amount = formatAmount(data.amount, data.currency);
  const user = data.userName || data.userEmail || 'Usuario no especificado';
  const rows = [
    renderRow('Usuario', user),
    renderRow('Email', data.userEmail),
    renderRow('Monto', amount),
    renderRow('Estado', data.status),
    renderRow('Metodo de pago', data.paymentMethod),
    renderRow('ID de operacion', data.operationId),
    renderRow('Referencia', data.reference),
    renderRow('Fecha', formatDate(data.createdAt)),
    renderDetails(data.details),
  ].join('');

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(meta.title)}</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f7fa; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="background:linear-gradient(90deg, #ff7a18, #21c97a); padding:20px 0;">
                <h1 style="margin:0; font-size:32px; font-weight:bold; font-family: Arial, sans-serif; color:#ffffff;">
                  <span style="color:#ff7a18;">B</span><span style="color:#21c97a;">eland</span>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 30px 28px; text-align:left;">
                <span style="display:inline-block; margin-bottom:16px; padding:7px 12px; border-radius:999px; font-size:12px; font-weight:700; color:${meta.color}; background:${meta.background};">
                  ${escapeHtml(meta.badge)}
                </span>
                <h2 style="margin:0 0 12px; font-size:23px; font-weight:700; color:#101828;">${escapeHtml(meta.title)}</h2>
                <p style="margin:0 0 22px; font-size:16px; line-height:1.6; color:#555;">
                  ${escapeHtml(data.description || meta.intro)}
                </p>
                <div style="margin:0 0 24px; padding:18px; border-radius:10px; background:${meta.background}; border:1px solid ${meta.color}; text-align:center;">
                  <p style="margin:0 0 6px; font-size:13px; font-weight:700; color:#667085; text-transform:uppercase;">Monto</p>
                  <p style="margin:0; font-size:30px; line-height:1.2; font-weight:800; color:${meta.color};">${amount}</p>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${rows}
                </table>
                ${
                  data.adminUrl
                    ? `<div style="margin-top:28px; text-align:center;">
                        <a href="${escapeHtml(data.adminUrl)}" style="display:inline-block; padding:12px 20px; border-radius:8px; background:#21c97a; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none;">Revisar en admin</a>
                      </div>`
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#f9fafb; padding:20px; font-size:12px; color:#999;">
                &copy; ${new Date().getFullYear()} Beland. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export function superadminNotificationEmailSubject(
  type: SuperadminNotificationType,
): string {
  return `Beland - ${notificationMeta[type].title}`;
}
