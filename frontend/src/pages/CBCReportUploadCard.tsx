import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from '../hooks/useTranslation';

const REFERENCE_RANGES = {
  Haemoglobin: { min: 13, max: 17, unit: 'g/dL', flag: 'Low → Anemia risk' },
  'Total Leucocyte Count': { min: 4000, max: 10000, unit: '/cumm', flag: 'High → Possible infection' },
  Neutrophils: { min: 40, max: 80, unit: '%', flag: 'High → Bacterial infection' },
  Lymphocytes: { min: 20, max: 40, unit: '%', flag: 'Low → Stress/Infection' },
  Eosinophils: { min: 1, max: 6, unit: '%', flag: '' },
  Monocytes: { min: 2, max: 10, unit: '%', flag: '' },
  Basophils: { min: 0, max: 1, unit: '%', flag: '' },
  'Absolute Neutrophils': { min: 2000, max: 7000, unit: '/cumm', flag: '' },
  'Absolute Lymphocytes': { min: 1000, max: 3000, unit: '/cumm', flag: '' },
  'Absolute Eosinophils': { min: 20, max: 500, unit: '/cumm', flag: '' },
  'Absolute Monocytes': { min: 200, max: 1000, unit: '/cumm', flag: '' },
  'RBC Count': { min: 4.5, max: 5.5, unit: 'Million/cumm', flag: '' },
  MCV: { min: 81, max: 101, unit: 'fL', flag: '' },
  MCH: { min: 27, max: 32, unit: 'pg', flag: '' },
  MCHC: { min: 31.5, max: 34.5, unit: 'g/dL', flag: '' },
  Hct: { min: 40, max: 50, unit: '%', flag: '' },
  Platelet: { min: 150000, max: 410000, unit: '/cumm', flag: 'Low → Bleeding risk' },
  'Platelet Count': { min: 150000, max: 410000, unit: '/cumm', flag: 'Low → Bleeding risk' },
};

type CBCKey = keyof typeof REFERENCE_RANGES;




// Helper: Precautions, Diet, and Symptoms
function getPrecautionsAndDiet(key: CBCKey, value: number) {
  switch (key) {
    case 'Haemoglobin':
      if (value < REFERENCE_RANGES[key].min) return 'Increase iron-rich foods (spinach, beans, red meat), vitamin C, avoid tea/coffee with meals.';
      if (value > REFERENCE_RANGES[key].max) return 'Check for dehydration, consult doctor.';
      break;
    case 'Total Leucocyte Count':
      if (value < REFERENCE_RANGES[key].min) return 'Avoid crowds, practice good hygiene, consult doctor if fever.';
      if (value > REFERENCE_RANGES[key].max) return 'Possible infection, hydrate, rest, consult doctor.';
      break;
    case 'RBC Count':
      if (value < REFERENCE_RANGES[key].min) return 'Iron, B12, and folate-rich diet; lean meats, legumes, leafy greens. Consider multivitamin after consulting a doctor.';
      if (value > REFERENCE_RANGES[key].max) return 'Hydrate well; evaluate altitude exposure or smoking; discuss with physician.';
      break;
    case 'MCV':
      if (value < REFERENCE_RANGES[key].min) return 'Consider iron therapy foods; investigate thalassemia/iron deficiency with your clinician.';
      if (value > REFERENCE_RANGES[key].max) return 'Increase B12/folate sources (eggs, dairy, greens, legumes); limit alcohol.';
      break;
    case 'MCH':
      if (value < REFERENCE_RANGES[key].min) return 'Iron-rich foods and vitamin C to improve absorption; regular meals.';
      if (value > REFERENCE_RANGES[key].max) return 'Assess B12/folate intake; balanced diet and hydration.';
      break;
    case 'MCHC':
      if (value < REFERENCE_RANGES[key].min) return 'Iron and protein-rich diet; avoid tea/coffee with meals.';
      if (value > REFERENCE_RANGES[key].max) return 'Hydration and routine follow-up; consult for possible spherocytosis if persistent.';
      break;
    case 'Hct':
      if (value < REFERENCE_RANGES[key].min) return 'Iron/B12/folate intake; hydrate; monitor fatigue and breathlessness.';
      if (value > REFERENCE_RANGES[key].max) return 'Increase water; consider evaluation for dehydration or polycythemia.';
      break;
    case 'Platelet Count':
      if (value < REFERENCE_RANGES[key].min) return 'Avoid injury, take vitamin K foods (leafy greens), consult doctor.';
      if (value > REFERENCE_RANGES[key].max) return 'Monitor for clotting, consult doctor.';
      break;
    case 'Platelet':
      if (value < REFERENCE_RANGES[key].min) return 'Avoid contact sports/NSAIDs; include vitamin K foods; medical advice if bleeding.';
      if (value > REFERENCE_RANGES[key].max) return 'Stay hydrated; discuss thrombosis risks with a clinician.';
      break;
    case 'Neutrophils':
      if (value < REFERENCE_RANGES[key].min) return 'Practice infection prevention, avoid raw foods.';
      if (value > REFERENCE_RANGES[key].max) return 'May indicate acute infection, monitor symptoms.';
      break;
    case 'Lymphocytes':
      if (value < REFERENCE_RANGES[key].min) return 'Support immunity: balanced diet, rest.';
      if (value > REFERENCE_RANGES[key].max) return 'May indicate viral infection, consult doctor.';
      break;
    case 'Eosinophils':
      if (value > REFERENCE_RANGES[key].max) return 'Check for allergies, avoid triggers.';
      break;
    case 'Monocytes':
      if (value > REFERENCE_RANGES[key].max) return 'Monitor for chronic infection, consult doctor.';
      break;
    case 'Basophils':
      if (value > REFERENCE_RANGES[key].max) return 'May indicate allergy or inflammation.';
      break;
    case 'Absolute Neutrophils':
      if (value < REFERENCE_RANGES[key].min) return 'Neutropenic precautions: hand hygiene, avoid raw/undercooked food, prompt fever reporting.';
      if (value > REFERENCE_RANGES[key].max) return 'Likely infection/inflammation; hydrate and rest; medical review advised.';
      break;
    case 'Absolute Lymphocytes':
      if (value < REFERENCE_RANGES[key].min) return 'Adequate sleep, balanced diet; review medications that suppress immunity.';
      if (value > REFERENCE_RANGES[key].max) return 'Often viral; hydration, rest, and clinical correlation.';
      break;
    case 'Absolute Eosinophils':
      if (value > REFERENCE_RANGES[key].max) return 'Allergen avoidance, anti-parasitic evaluation if symptomatic; consider antihistamines as advised.';
      break;
    case 'Absolute Monocytes':
      if (value > REFERENCE_RANGES[key].max) return 'Assess chronic infections/inflammation; anti-inflammatory diet (fruits, veggies, omega-3).';
      break;
    default:
      return 'Maintain a balanced diet, hydrate well, and schedule follow-up testing if abnormalities persist.';
  }
  return 'Maintain a balanced diet, hydrate well, and schedule follow-up testing if abnormalities persist.';
}

// Split guidance text into bullet points for consistent alignment in PDF and UI
function toBullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/[\n;\.]+/)
    .map(s => s.replace(/^[\-•\s]+/, '').trim())
    .filter(Boolean);
}

function getPredictedSymptoms(key: CBCKey, value: number): string {
  const low = value < REFERENCE_RANGES[key].min;
  const high = value > REFERENCE_RANGES[key].max;
  if (!(low || high)) return 'Non-specific changes; correlate clinically and consider follow-up testing.';
  switch (key) {
    case 'Haemoglobin':
      return low ? 'Anemia: fatigue, pallor, breathlessness.' : 'Polycythemia/dehydration: headache, dizziness, reddish skin.';
    case 'RBC Count':
      return low ? 'Anemia/bleeding: fatigue, weakness.' : 'Polycythemia: headache, flushing.';
    case 'Total Leucocyte Count':
      return low ? 'Leukopenia: infection risk, fever.' : 'Leukocytosis: infection/inflammation signs.';
    case 'MCH':
      if (value < REFERENCE_RANGES[key].min) return 'Hypochromia: iron deficiency features.';
      if (value > REFERENCE_RANGES[key].max) return 'Macrocytic processes, B12/folate deficiency.';
      break;
    case 'MCHC':
      if (value < REFERENCE_RANGES[key].min) return 'Iron deficiency anemia signs.';
      if (value > REFERENCE_RANGES[key].max) return 'Possible hereditary spherocytosis; further evaluation.';
      break;
    case 'Hct':
      if (value < REFERENCE_RANGES[key].min) return 'Anemia symptoms similar to low Hb.';
      if (value > REFERENCE_RANGES[key].max) return 'Dehydration/polycythemia symptoms: headache, blurred vision.';
      break;
    case 'Platelet Count':
      if (value < REFERENCE_RANGES[key].min) return 'Easy bruising, bleeding, petechiae.';
      if (value > REFERENCE_RANGES[key].max) return 'Headache, chest pain, tingling.';
      break;
    case 'Platelet':
      if (value < REFERENCE_RANGES[key].min) return 'Bleeding gums, nosebleeds, petechiae.';
      if (value > REFERENCE_RANGES[key].max) return 'Thrombosis risk: limb swelling, chest pain, visual changes (urgent eval if severe).';
      break;
    case 'Neutrophils':
      if (value < REFERENCE_RANGES[key].min) return 'Mouth ulcers, fever, frequent infections.';
      if (value > REFERENCE_RANGES[key].max) return 'Fever, pus, acute inflammation.';
      break;
    case 'Lymphocytes':
      if (value < REFERENCE_RANGES[key].min) return 'Increased risk of infection.';
      if (value > REFERENCE_RANGES[key].max) return 'Swollen lymph nodes, sore throat.';
      break;
    case 'Eosinophils':
      if (value > REFERENCE_RANGES[key].max) return 'Allergy symptoms: rash, itching, asthma.';
      break;
    case 'Monocytes':
      if (value > REFERENCE_RANGES[key].max) return 'Fatigue, fever, chronic symptoms.';
      break;
    case 'Basophils':
      if (value > REFERENCE_RANGES[key].max) return 'Itching, allergy symptoms.';
      break;
    case 'Absolute Neutrophils':
      if (value < REFERENCE_RANGES[key].min) return 'Neutropenia: recurrent infections, fever; emergency if fever > 38°C.';
      if (value > REFERENCE_RANGES[key].max) return 'Acute bacterial infection/inflammation likely.';
      break;
    case 'Absolute Lymphocytes':
      if (value < REFERENCE_RANGES[key].min) return 'Lymphopenia: frequent colds/infections.';
      if (value > REFERENCE_RANGES[key].max) return 'Viral infections, occasionally lymphoproliferative disorders.';
      break;
    case 'Absolute Eosinophils':
      if (value > REFERENCE_RANGES[key].max) return 'Allergic disease, asthma, parasitic infections.';
      break;
    case 'Absolute Monocytes':
      if (value > REFERENCE_RANGES[key].max) return 'Chronic inflammatory/infectious conditions.';
      break;
    default:
      return 'Non-specific changes; correlate clinically and consider follow-up testing.';
  }
  return 'Non-specific changes; correlate clinically and consider follow-up testing.';
}

const CBCReportUploadCard = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [extracted, setExtracted] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const guidanceRef = useRef<HTMLDivElement>(null);

  // Improved CBC extraction: robust to label variations and numeric formats
  const extractCBC = (text: string) => {
    const normalized = text
      .replace(/[|]/g, ' ') // common OCR artifacts
      .replace(/\t+/g, ' ')
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ') // non-breaking space
      .replace(/\s+/g, ' ');

    const UPPER = normalized.toUpperCase();

    // Map various OCR label variants to our canonical CBC keys
    const ALIASES: Record<string, CBCKey> = {
      'HEMOGLOBIN': 'Haemoglobin',
      'HAEMOGLOBIN': 'Haemoglobin',
      'HB': 'Haemoglobin',
      'HGB': 'Haemoglobin',
      'TOTAL LEUCOCYTE COUNT': 'Total Leucocyte Count',
      'TOTAL LEUKOCYTE COUNT': 'Total Leucocyte Count',
      'WBC': 'Total Leucocyte Count',
      'TOTAL WBC': 'Total Leucocyte Count',
      'NEUTROPHIL': 'Neutrophils',
      'NEUTROPHILS': 'Neutrophils',
      'LYMPHOCYTE': 'Lymphocytes',
      'LYMPHOCYTES': 'Lymphocytes',
      'EOSINOPHIL': 'Eosinophils',
      'EOSINOPHILS': 'Eosinophils',
      'MONOCYTE': 'Monocytes',
      'MONOCYTES': 'Monocytes',
      'BASOPHIL': 'Basophils',
      'BASOPHILS': 'Basophils',
      'ABSOLUTE NEUTROPHILS': 'Absolute Neutrophils',
      'ABSOLUTE LYMPHOCYTES': 'Absolute Lymphocytes',
      'ABSOLUTE EOSINOPHILS': 'Absolute Eosinophils',
      'ABSOLUTE MONOCYTES': 'Absolute Monocytes',
      'RBC COUNT': 'RBC Count',
      'TOTAL RBC COUNT': 'RBC Count',
      'RBC': 'RBC Count',
      'HCT': 'Hct',
      'PCV': 'Hct',
      'HEMATOCRIT VALUE, HCT': 'Hct',
      'HEMATOCRIT VALUE': 'Hct',
      'MEAN CORPUSCULAR VOLUME, MCV': 'MCV',
      'MCV': 'MCV',
      'MEAN CELL HAEMOGLOBIN, MCH': 'MCH',
      'MCH': 'MCH',
      'MEAN CELL HAEMOGLOBIN CON, MCHC': 'MCHC',
      'MCHC': 'MCHC',
      'PLATELET COUNT': 'Platelet Count',
      'PLATELETS': 'Platelet Count',
      'PLATELET': 'Platelet',
      'PLT': 'Platelet',
    };

    const result: Record<CBCKey, number> = {} as any;

    // Number matcher: supports 5,100 or 5 , 100 or 35.7 or 3 . 5
    const numberRe = /([0-9]{1,3}(?:[\s,][0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/;

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Search globally: label followed within ~60 chars by a number (spanning across whitespace)
    Object.entries(ALIASES).forEach(([alias, canonical]) => {
      if (result[canonical] !== undefined) return; // don't overwrite if already found by another alias
      const pattern = new RegExp(`${escape(alias)}[^0-9]{0,60}?${numberRe.source}`, 'i');
      const m = UPPER.match(pattern);
      if (!m) return;
      // Extract the numeric string from the overall match
      const numMatch = m[m.length - 1] || '';
      let raw = String(numMatch).replace(/[,\s]/g, '');
      let val = parseFloat(raw);
      if (isNaN(val)) return;
      // For platelet rows, detect lakh(s) around the match in original text window
      const start = Math.max(0, (m.index || 0) - 20);
      const end = Math.min(UPPER.length, (m.index || 0) + m[0].length + 20);
      const window = UPPER.slice(start, end);
      if ((canonical === 'Platelet' || canonical === 'Platelet Count') && /LAKH/i.test(window)) {
        val = val * 100000;
      }
      result[canonical] = val;
    });

    setExtracted(result);
  };

  const handleClear = () => {
    setFile(null);
    setOcrText('');
    setExtracted(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    const { data } = await Tesseract.recognize(f, 'eng');
    setOcrText(data.text);
    extractCBC(data.text);
    setLoading(false);
  };

  const handleDownloadPdf = async () => {
    if (!mainRef.current || !guidanceRef.current) return;

    const opts: Parameters<typeof html2canvas>[1] = {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    };

    // Helper to force monochrome and remove backgrounds inline, with restore support
    const applyMonochrome = (root: HTMLElement) => {
      const changed: Array<{ el: HTMLElement; styles: Partial<CSSStyleDeclaration> }> = [];
      const all = root.querySelectorAll<HTMLElement>('*');
      const setStyle = (el: HTMLElement, prop: keyof CSSStyleDeclaration, val: string) => {
        const prev = (el.style as any)[prop] as string;
        if (prev !== val) {
          const entry = changed.find(c => c.el === el);
          if (entry) {
            (entry.styles as any)[prop] = prev;
          } else {
            changed.push({ el, styles: { [prop]: prev } as any });
          }
          (el.style as any)[prop] = val;
        }
      };
      // Apply to root itself too
      [root, ...Array.from(all)].forEach(el => {
        setStyle(el, 'backgroundColor', '#ffffff');
        setStyle(el, 'backgroundImage', 'none');
        setStyle(el, 'color', '#000000');
        setStyle(el, 'filter', 'grayscale(100%)');
        setStyle(el, 'webkitFilter' as any, 'grayscale(100%)');
        setStyle(el, 'boxShadow', 'none');
        // If borders exist, ensure visible in B/W
        if (getComputedStyle(el).borderStyle !== 'none') {
          setStyle(el, 'borderColor', '#000000');
        }
        // Strengthen table borders
        const tag = el.tagName.toLowerCase();
        if (tag === 'table' || tag === 'th' || tag === 'td') {
          setStyle(el, 'borderStyle', 'solid');
          setStyle(el, 'borderWidth', '1px');
          setStyle(el, 'borderColor', '#000000');
        }
        // Normalize SVG colors
        if (el.tagName.toLowerCase() === 'svg') {
          (el as any).setAttribute('fill', '#000');
          (el as any).setAttribute('stroke', '#000');
        }
      });
      return () => {
        changed.forEach(({ el, styles }) => {
          Object.keys(styles).forEach(k => {
            (el.style as any)[k] = (styles as any)[k] ?? '';
          });
        });
      };
    };

    // Apply to both sections
    const restoreMain = applyMonochrome(mainRef.current);
    const restoreGuidance = applyMonochrome(guidanceRef.current);

    // Render first page (table + chart) and second page (guidance)
    const mainCanvas = await html2canvas(mainRef.current, opts);
    const guidanceCanvas = await html2canvas(guidanceRef.current, opts);

    // Restore original styles
    restoreMain();
    restoreGuidance();

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // mm
    const contentWidth = pageWidth - margin * 2;

    const addCanvasAsPage = (canvas: HTMLCanvasElement, isFirstPage: boolean) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (!isFirstPage) pdf.addPage('a4', 'p');
      // Title
      const title = 'CBC Report';
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      const titleY = margin + 5;
      pdf.text(title, pageWidth / 2, titleY, { align: 'center' });
      // Content below title
      const yStart = titleY + 8;
      const maxHeight = pageHeight - yStart - margin;
      pdf.addImage(imgData, 'PNG', margin, yStart, imgWidth, Math.min(imgHeight, maxHeight), undefined, 'FAST');
    };

    addCanvasAsPage(mainCanvas, true);
    addCanvasAsPage(guidanceCanvas, false);

    pdf.save('patient_report.pdf');
  };

  return (
    <div>
      {/* Print styles: only print report area, grayscale, A4 page */}
      <style>
        {`@media print {
            /* Show ONLY the CBC report area */
            body * { visibility: hidden !important; }
            #cbc-print-area, #cbc-print-area * { visibility: visible !important; }
            #cbc-print-area { position: absolute; left: 0; top: 0; width: 100%; background: #ffffff !important; color: #000000 !important; -webkit-filter: grayscale(100%); filter: grayscale(100%); }
            @page { size: A4 portrait; margin: 12mm; }
            .no-print { display: none !important; }
            /* Ensure chart and table render nicely in print */
            .print-chart { width: 100% !important; height: 320px !important; }
            .print-table th, .print-table td { border: 1px solid #000 !important; }
        }`}
      </style>
      {!file && (
        <div className="flex flex-col items-center mb-4">
          <button
            type="button"
            disabled={loading}
            aria-disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent-400 ${loading ? 'bg-accent-400 cursor-not-allowed opacity-60' : 'bg-accent-600 hover:bg-accent-700 text-white'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
            {loading ? t('common.loading') : t('reports.uploadReport')}
          </button>
          <input
            type="file"
            accept="image/*,application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
      {file && (
        <div className="mb-4">
          <div className="flex justify-end no-print">
            <button
              type="button"
              onClick={handleClear}
              title="Remove this report"
              aria-label="Remove this report"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <img src={URL.createObjectURL(file)} alt="CBC Report Preview" className="max-h-60 rounded shadow" />
          </div>
        </div>
      )}
      {loading && <div>{t('common.loading')}</div>}
      {extracted && (
        <div className="mt-4" id="cbc-print-area" ref={reportRef}>
          <h4 className="font-bold mb-2">{t('reports.cbcReport')}</h4>
          <div ref={mainRef}>
          <table className="min-w-full border text-xs print-table">
            <thead>
              <tr>
                <th className="border px-2 py-2 leading-relaxed">{t('reports.reportType')}</th>
                <th className="border px-2 py-2 leading-relaxed">{t('reports.result')}</th>
                <th className="border px-2 py-2 leading-relaxed">{t('inventory.unit')}</th>
                <th className="border px-2 py-2 leading-relaxed">{t('reports.normalRange')}</th>
                <th className="border px-2 py-2 leading-relaxed">{t('appointment.status')}</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(REFERENCE_RANGES) as CBCKey[]).map(key => {
                let rowClass = '';
                if (extracted[key] !== undefined) {
                  if (extracted[key] < REFERENCE_RANGES[key].min) rowClass = 'bg-yellow-100 dark:bg-yellow-900/40';
                  else if (extracted[key] > REFERENCE_RANGES[key].max) rowClass = 'bg-red-100 dark:bg-red-900/40';
                  else rowClass = 'bg-green-50 dark:bg-green-900/40';
                }
                return (
                  <tr key={key} className={rowClass + ' transition-all'}>
                    <td className="border px-2 py-1.5 leading-relaxed break-words font-semibold">{key}</td>
                    <td className="border px-2 py-1.5 leading-relaxed break-words">{extracted[key] !== undefined ? extracted[key] : '--'}</td>
                    <td className="border px-2 py-1.5 leading-relaxed break-words">{REFERENCE_RANGES[key].unit}</td>
                    <td className="border px-2 py-1.5 leading-relaxed break-words">{REFERENCE_RANGES[key].min} - {REFERENCE_RANGES[key].max}</td>
                    <td className="border px-2 py-1.5 leading-relaxed break-words">
                      {extracted[key] !== undefined && (
                        <span className="font-semibold status-text">
                          {extracted[key] < REFERENCE_RANGES[key].min
                            ? t('ward.lowStock')
                            : extracted[key] > REFERENCE_RANGES[key].max
                            ? 'High'
                            : 'Normal'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6">
            <div className="w-full print-chart">
              <h4 className="font-bold mb-2">{t('reports.cbcReport')} {t('analytics.overview')}</h4>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={Object.keys(extracted).map(key => ({ name: key, value: extracted[key] }))} margin={{ left: 12, right: 24, top: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80}/>
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Line chart for trends if multiple uploads are supported in future */}

        {/* Precautions, Diet, and Predicted Symptoms (single entry) */}
        <div className="mt-8" ref={guidanceRef}>
          <h4 className="font-bold mb-2 text-lg">{t('reports.recommendations')}</h4>
          {(() => {
            const abnormalKeys = (Object.keys(REFERENCE_RANGES) as CBCKey[]).filter(k => {
              const v = extracted[k];
              return v !== undefined && (v < REFERENCE_RANGES[k].min || v > REFERENCE_RANGES[k].max);
            });
            if (abnormalKeys.length === 0) {
              return (
                <div className="bg-yellow-100 text-yellow-900 rounded p-4 text-center font-semibold">
                  {t('reports.uploadReport')}
                </div>
              );
            }
            const key = abnormalKeys[0];
            const precaution = getPrecautionsAndDiet(key, extracted[key]) || 'Maintain a balanced diet, hydrate well, and seek medical advice if symptoms persist.';
            const symptoms = getPredictedSymptoms(key, extracted[key]) || 'Non-specific changes; correlate clinically and consider follow-up testing.';
            return (
              <div className="p-0 text-gray-900 dark:text-white antialiased">
                <div className="text-sm text-gray-800 dark:text-gray-200 mb-3">Summary based on the most relevant abnormal parameter.</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2" />
                  <div className="grid md:grid-cols-2 gap-10 items-start content-start">
                    <div className="flex items-start gap-3 p-3">
                      <span className="flex-none mt-0.5">⚠️</span>
                      <div>
                        <div className="font-semibold mb-2 text-gray-900 dark:text-white">{t('reports.recommendations')}</div>
                        <ul className="pdf-ul text-sm leading-6 break-words whitespace-normal list-disc pl-5 space-y-1 text-gray-900 dark:text-white">
                          {toBullets(precaution).slice(0, 3).map((b, idx) => (<li key={idx}>{b}</li>))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3">
                      <span className="flex-none mt-0.5">🩺</span>
                      <div>
                        <div className="font-semibold mb-2 text-gray-900 dark:text-white">{t('reports.findings')}</div>
                        <ul className="pdf-ul text-sm italic leading-6 break-words whitespace-normal list-disc pl-5 space-y-1 text-gray-900 dark:text-white">
                          {toBullets(symptoms).slice(0, 3).map((b, idx) => (<li key={idx}>{b}</li>))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          </div>
        </div>
      )}
      {file && extracted && (
        <div className="mt-4 flex justify-end no-print">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-green-600 text-green-700 hover:bg-green-700/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/><path d="M7 10a1 1 0 001.707.707L9 10.414V4a1 1 0 112 0v6.414l.293-.293A1 1 0 1112.707 11.707l-3 3a1 1 0 01-1.414 0l-3-3A1 1 0 017 10z"/></svg>
            {t('common.download')} {t('reports.cbcReport')} (PDF)
          </button>
        </div>
      )}
    </div>
  );
};

export default CBCReportUploadCard;
