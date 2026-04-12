import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Packer,
  ShadingType,
} from 'docx'
import type { Quote } from '@/types/quote'
import type { AppSettings } from '@/types/settings'
import type { QuoteCalculation } from '@/utils/calculations'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { getServiceType } from '@/data/services'
import { PHASES } from '@/data/phases'

const BLUE = '1e3a5f'
const GRAY = '64748b'

function text(content: string, opts: Partial<ConstructorParameters<typeof TextRun>[0]> = {}) {
  return new TextRun({ text: content, font: 'Inter', size: 18, ...opts })
}

function emptyPara() {
  return new Paragraph({ children: [] })
}

export async function generateDocx(
  quote: Quote,
  settings: AppSettings,
  calc: QuoteCalculation
): Promise<Blob> {
  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  const children: (Paragraph | Table)[] = []

  // Header
  children.push(new Paragraph({ children: [text(settings.professional.name || 'Nome Professionista', { bold: true, size: 28, color: BLUE })] }))
  children.push(new Paragraph({ children: [text(settings.professional.title, { size: 16, color: GRAY })] }))
  if (settings.professional.address) children.push(new Paragraph({ children: [text(settings.professional.address, { size: 16, color: GRAY })] }))
  if (settings.professional.city) children.push(new Paragraph({ children: [text(`${settings.professional.cap} ${settings.professional.city} (${settings.professional.province})`, { size: 16, color: GRAY })] }))
  if (settings.professional.codiceFiscale) children.push(new Paragraph({ children: [text(`C.F.: ${settings.professional.codiceFiscale}`, { size: 16, color: GRAY })] }))
  if (settings.professional.email) children.push(new Paragraph({ children: [text(settings.professional.email, { size: 16, color: GRAY })] }))

  children.push(emptyPara())

  // Title
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [text('PREVENTIVO', { bold: true, size: 36, color: BLUE })] }))
  children.push(new Paragraph({ children: [text(`N.: ${quote.quoteNumber}    Data: ${formatDate(quote.createdAt)}    Validità: ${formatDate(quote.validUntil)}`, { size: 16, color: GRAY })] }))
  children.push(emptyPara())

  // Client
  children.push(new Paragraph({ children: [text('Spett.le', { size: 16, color: GRAY })] }))
  children.push(new Paragraph({ children: [text(quote.client.name || '---', { bold: true, size: 22 })] }))
  if (quote.client.address) children.push(new Paragraph({ children: [text(quote.client.address, { size: 16, color: GRAY })] }))
  if (quote.client.city) children.push(new Paragraph({ children: [text(`${quote.client.cap} ${quote.client.city} (${quote.client.province})`, { size: 16, color: GRAY })] }))
  if (quote.client.partitaIva) children.push(new Paragraph({ children: [text(`P.IVA: ${quote.client.partitaIva}`, { size: 16, color: GRAY })] }))
  if (quote.client.codiceFiscale) children.push(new Paragraph({ children: [text(`C.F.: ${quote.client.codiceFiscale}`, { size: 16, color: GRAY })] }))
  children.push(emptyPara())

  // Object
  if (serviceType) {
    children.push(new Paragraph({ children: [text('Oggetto: ', { bold: true, size: 20 }), text(serviceType.label, { size: 20 })] }))
  }
  children.push(emptyPara())

  // Phase items
  const phaseItems = quote.lineItems.filter((li) => li.category === 'phase')
  const extraItems = quote.lineItems.filter((li) => li.category === 'extra' || li.category === 'addon' || li.category === 'consulting' || li.category === 'custom')

  if (phaseItems.length > 0) {
    children.push(new Paragraph({ children: [text('ATTIVITÀ INCLUSE', { bold: true, size: 20, color: BLUE })] }))
    children.push(emptyPara())

    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
    const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' }

    for (const item of phaseItems) {
      const phaseTemplate = PHASES.find((p) => p.id === item.phaseId)
      const quotePhase = quote.phases.find((p) => p.phaseId === item.phaseId)
      const enabledActivities = quotePhase?.activities
        .filter((a) => a.enabled)
        .map((a) => phaseTemplate?.activities.find((at) => at.id === a.activityId)?.label)
        .filter(Boolean) || []

      // Phase header row
      children.push(new Paragraph({
        shading: { type: ShadingType.SOLID, fill: BLUE, color: BLUE },
        children: [
          text(`${item.description}`, { bold: true, size: 18, color: 'FFFFFF' }),
          text(`    ${formatCurrency(item.unitPrice)}`, { bold: true, size: 18, color: 'FFFFFF' }),
        ],
      }))

      // Description
      if (phaseTemplate) {
        children.push(new Paragraph({ children: [text(phaseTemplate.description, { size: 14, color: GRAY })] }))
      }

      // Activities
      for (const activity of enabledActivities) {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [text(activity as string, { size: 14, color: '333333' })],
        }))
      }

      children.push(emptyPara())
    }
  }

  // Extra items
  if (extraItems.length > 0) {
    children.push(new Paragraph({ children: [text('EXTRA OPZIONALI', { bold: true, size: 20, color: BLUE })] }))
    children.push(emptyPara())

    for (const item of extraItems) {
      children.push(new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          text(`${item.description}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`, { size: 16 }),
          text(`    ${formatCurrency(item.quantity * item.unitPrice)}`, { size: 16, bold: true }),
        ],
      }))
    }
    children.push(emptyPara())
  }

  // Totals
  const totals: [string, string][] = [['Subtotale', formatCurrency(calc.subtotal)]]
  if (calc.discountAmount > 0) totals.push([`Sconto (${quote.discount.percentage}%)`, `-${formatCurrency(calc.discountAmount)}`])
  if (calc.urgencySurcharge > 0) totals.push(['Maggiorazione urgenza', `+${formatCurrency(calc.urgencySurcharge)}`])
  totals.push(['Compenso lordo', formatCurrency(calc.compensoLordo)])
  if (calc.ritenutaAcconto > 0) totals.push(["Ritenuta d'acconto (20%)", `-${formatCurrency(calc.ritenutaAcconto)}`])
  if (calc.marcaDaBollo > 0) totals.push(['Marca da bollo', formatCurrency(calc.marcaDaBollo)])

  for (const [label, value] of totals) {
    children.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [text(`${label}: `, { size: 16, color: GRAY }), text(value, { size: 16, bold: true })] }))
  }
  children.push(emptyPara())
  children.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: [text('NETTO A PAGARE: ', { size: 22, bold: true, color: BLUE }), text(formatCurrency(calc.totaleDovuto), { size: 22, bold: true, color: BLUE })] }))

  // Legal
  const legalParts = [
    "Prestazione occasionale ai sensi dell'art. 2222 e seguenti del Codice Civile.",
    "Operazione fuori campo IVA ai sensi dell'art. 5 DPR 633/72.",
  ]
  if (quote.taxConfig.ritenutaAcconto) legalParts.push("Ritenuta d'acconto 20% ai sensi dell'art. 25 DPR 600/73.")
  if (calc.marcaDaBollo > 0) legalParts.push("Imposta di bollo assolta sull'originale - 2,00 EUR.")
  children.push(emptyPara())
  children.push(new Paragraph({ children: [text(legalParts.join(' '), { size: 14, color: GRAY })] }))

  // Notes & Terms
  if (quote.notes) {
    children.push(emptyPara())
    children.push(new Paragraph({ children: [text('Note', { bold: true, size: 20, color: BLUE })] }))
    children.push(new Paragraph({ children: [text(quote.notes, { size: 16, color: GRAY })] }))
  }
  if (quote.termsAndConditions) {
    children.push(emptyPara())
    children.push(new Paragraph({ children: [text('Termini e Condizioni', { bold: true, size: 20, color: BLUE })] }))
    for (const line of quote.termsAndConditions.split('\n')) {
      children.push(new Paragraph({ children: [text(line, { size: 14, color: GRAY })] }))
    }
  }

  const doc = new Document({ sections: [{ children }] })
  return Packer.toBlob(doc)
}
