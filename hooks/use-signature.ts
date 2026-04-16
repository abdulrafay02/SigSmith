import { useState, useCallback, useMemo, useEffect } from 'react';
import { escapeHtml } from '@/lib/utils';
import type { SignatureData, Sparkle } from '@/lib/types';

const SPARKLE_COUNT = 12;
const DEFAULT_LOGO = '/logo.png';

export function useSignature() {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: 'Geralt of Rivia',
    title: 'Monster Hunter',
    company: 'Witcher Services LLC',
    phone: '+1 (555) 000-WOLF',
    twitter: '@blaviken_butcher',
    linkedin: 'geralt-of-rivia',
    website: 'https://kaermorhen.com',
    logoUrl: DEFAULT_LOGO
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generatedSparkles = Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      delay: Math.random() * 0.2,
    }));
    const timer = setTimeout(() => setSparkles(generatedSparkles), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureData(prev => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  const generatedHtml = useMemo(() => {
    const { name, title, company, phone, twitter, linkedin, website, logoUrl } = signatureData;

    const sName = escapeHtml(name || 'Your Name');
    const sTitle = escapeHtml(title || 'Your Title');
    const sCompany = escapeHtml(company);
    const sPhone = escapeHtml(phone);
    const sTwitter = escapeHtml(twitter);
    const sLinkedin = escapeHtml(linkedin);
    const sWebsite = escapeHtml(website);
    const sLogoUrl = escapeHtml(logoUrl);

    const contactParts = [
      sPhone ? `<span>${sPhone}</span>` : null,
      sTwitter ? `<a href="https://x.com/${sTwitter.replace('@', '')}" style="color: #a1a1aa; text-decoration: none;">${sTwitter}</a>` : null,
      sLinkedin ? `<a href="https://linkedin.com/in/${sLinkedin}" style="color: #a1a1aa; text-decoration: none;">LinkedIn</a>` : null,
      sWebsite ? `<a href="${sWebsite}" style="color: #a1a1aa; text-decoration: none;">${sWebsite.replace('https://', '').replace('http://', '')}</a>` : null
    ].filter(Boolean);

    const contactLine = contactParts.join(' &bull; ');

    return `
<table cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; line-height: 1.5;">
  <tr>
    <td style="padding-bottom: 12px;">
      <a href="${sWebsite || '#'}" target="_blank">
        <img src="${sLogoUrl}" alt="Logo" width="48" height="48" style="display: block; border-radius: 8px;">
      </a>
    </td>
  </tr>
  <tr>
    <td style="font-size: 16px; font-weight: 700; color: #000000;">${sName}</td>
  </tr>
  <tr>
    <td style="font-size: 14px; color: #71717a;">${sTitle}${sCompany ? ` @ ${sCompany}` : ''}</td>
  </tr>
  <tr>
    <td style="font-size: 13px; color: #a1a1aa; padding-top: 4px;">
      ${contactLine}
    </td>
  </tr>
</table>
    `.trim();
  }, [signatureData]);

  const copyToClipboard = useCallback(async () => {
    try {
      const htmlBlob = new Blob([generatedHtml], { type: 'text/html' });
      const textBlob = new Blob([generatedHtml], { type: 'text/plain' });

      if (typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          })
        ]);
      } else {
        await navigator.clipboard.writeText(generatedHtml);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy signature:', err);
    }
  }, [generatedHtml]);

  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);

  const updateField = useCallback((field: keyof SignatureData) => (value: string) => {
    setSignatureData(prev => ({ ...prev, [field]: value }));
    setLastUpdatedField(field);
  }, []);

  return {
    signatureData,
    isDarkMode,
    setIsDarkMode,
    isCopied,
    sparkles,
    lastUpdatedField,
    updateField,
    handleLogoUpload,
    copyToClipboard
  };
}
