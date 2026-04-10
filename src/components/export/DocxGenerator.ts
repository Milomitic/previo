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
  ImageRun,
  ShadingType,
} from 'docx'
import type { Quote } from '@/types/quote'
import type { AppSettings } from '@/types/settings'
import type { QuoteCalculation } from '@/utils/calculations'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { getServiceType } from '@/data/services'

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

  const children: Paragraph[] = []

  // Header - Professional info
  children.push(
    new Paragraph({
      children: [text(settings.professional.name || 'Nome Professionista', { bold: true, size: 28, color: BLUE })],
    })
  )
  children.push(
    new Paragraph({ children: [text(settings.professional.title, { size: 16, color: GRAY })] })
  )
  if (settings.professional.address) {
    children.push(new Paragraph({ children: [text(settings.professional.address, { size: 16, color: GRAY })] }))
  }
  if (settings.professional.city) {
    children.push(new Paragraph({
      children: [text(`${settings.professional.cap} ${settings.professional.city} (${settings.professional.province})`, { size: 16, color: GRAY })],
    }))
  }
  if (settings.professional.codiceFiscale) {
    children.push(new Paragraph({ children: [text(`C.F.: ${settings.professional.codiceFiscale}`, { size: 16, color: GRAY })] }))
  }
  if (settings.professional.email) {
    children.push(new Paragraph({ children: [text(settings.professional.email, { size: 16, color: GRAY })] }))
  }

  children.push(emptyPara())

  // Title
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [text('PREVENTIVO', { bold: true, size: 36, color: BLUE })],
    })
  )

  children.push(
    new Paragraph({
      children: [
        text(`N.: ${quote.quoteNumber}    Data: ${formatDate(quote.createdAt)}    Validita: ${formatDate(quote.validUntil)}`, { size: 16, color: GRAY }),
      ],
    })
  )

  children.push(emptyPara())

  // Client
  children.push(new Paragraph({ children: [text('Spett.le', { italics: true, size: 16, color: GRAY })] }))
  children.push(new Paragraph({ children: [text(quote.client.name || '---', { bold: true, size: 22 })] }))
  if (quote.client.address) {
    children.push(new Paragraph({ children: [text(quote.client.address, { size: 16, color: GRAY })] }))
  }
  if (quote.client.city) {
    children.push(new Paragraph({ children: [text(`${quote.client.cap} ${quote.client.city} (${quote.client.province})`, { size: 16, color: GRAY })] }))
  }
  if (quote.client.partitaIva) {
    children.push(new Paragraph({ children: [text(`P.IVA: ${quote.client.partitaIva}`, { size: 16, color: GRAY })] }))
  }
  if (quote.client.codiceFiscale) {
    children.push(new Paragraph({ children: [text(`C.F.: ${quote.client.codiceFiscale}`, { size: 16, color: GRAY })] }))
  }

  children.push(emptyPara())

  // Object
  if (serviceType) {
    children.push(
      new Paragraph({
        children: [
          text('Oggetto: ', { bold: true, size: 20 }),
          text(`${serviceType.label} — ${quote.pages} pagine`, { size: 20 }),
        ],
      })
    )
  }

  children.push(emptyPara())

  // Items table
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' }
  const cellBorders = { top: thinBorder, bottom: thinBorder, left: noBorder, right: noBorder }

  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [text('Descrizione', { bold: true, size: 16, color: 'FFFFFF' })] })],
        width: { size: 50, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, fill: BLUE, color: BLUE },
      }),
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text('Qty', { bold: true, size: 16, color: 'FFFFFF' })] })],
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, fill: BLUE, color: BLUE },
      }),
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text('Prezzo Unit.', { bold: true, size: 16, color: 'FFFFFF' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, fill: BLUE, color: BLUE },
      }),
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text('Importo', { bold: true, size: 16, color: 'FFFFFF' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, fill: BLUE, color: BLUE },
      }),
    ],
  })

  const itemRows = quote.lineItems.map(
    (item, i) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [text(item.description, { size: 16 })] })],
            borders: cellBorders,
            shading: i % 2 === 1 ? { type: ShadingType.SOLID, fill: 'f8fafc', color: 'f8fafc' } : undefined,
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text(String(item.quantity), { size: 16 })] })],
            borders: cellBorders,
            shading: i % 2 === 1 ? { type: ShadingType.SOLID, fill: 'f8fafc', color: 'f8fafc' } : undefined,
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text(formatCurrency(item.unitPrice), { size: 16 })] })],
            borders: cellBorders,
            shading: i % 2 === 1 ? { type: ShadingType.SOLID, fill: 'f8fafc', color: 'f8fafc' } : undefined,
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text(formatCurrency(item.quantity * item.unitPrice), { size: 16, bold: true })] })],
            borders: cellBorders,
            shading: i % 2 === 1 ? { type: ShadingType.SOLID, fill: 'f8fafc', color: 'f8fafc' } : undefined,
          }),
        ],
      })
  )

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...itemRows],
  })

  children.push(new Paragraph({ children: [] }))

  // Totals
  const totals: [string, string][] = [
    ['Subtotale', formatCurrency(calc.subtotal)],
  ]
  if (calc.discountAmount > 0) totals.push([`Sconto (${quote.discount.percentage}%)`, `-${formatCurrency(calc.discountAmount)}`])
  if (calc.urgencySurcharge > 0) totals.push(['Maggiorazione urgenza', `+${formatCurrency(calc.urgencySurcharge)}`])
  totals.push(['Compenso lordo', formatCurrency(calc.compensoLordo)])
  if (calc.ritenutaAcconto > 0) totals.push(["Ritenuta d'acconto (20%)", `-${formatCurrency(calc.ritenutaAcconto)}`])
  if (calc.marcaDaBollo > 0) totals.push(['Marca da bollo', formatCurrency(calc.marcaDaBollo)])

  const totalParas = totals.map(
    ([label, value]) =>
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          text(`${label}: `, { size: 16, color: GRAY }),
          text(value, { size: 16, bold: true }),
        ],
      })
  )

  totalParas.push(emptyPara())
  totalParas.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        text('NETTO A PAGARE: ', { size: 22, bold: true, color: BLUE }),
        text(formatCurrency(calc.totaleDovuto), { size: 22, bold: true, color: BLUE }),
      ],
    })
  )

  // Legal note
  const legalParts = [
    "Prestazione occasionale ai sensi dell'art. 2222 e seguenti del Codice Civile.",
    "Operazione fuori campo IVA ai sensi dell'art. 5 DPR 633/72.",
  ]
  if (quote.taxConfig.ritenutaAcconto) legalParts.push("Ritenuta d'acconto 20% ai sensi dell'art. 25 DPR 600/73.")
  if (calc.marcaDaBollo > 0) legalParts.push("Imposta di bollo assolta sull'originale - 2,00 EUR.")

  const legalPara = new Paragraph({
    children: [text(legalParts.join(' '), { size: 14, color: GRAY, italics: true })],
  })

  // Notes & Terms
  const noteParas: Paragraph[] = []
  if (quote.notes) {
    noteParas.push(emptyPara())
    noteParas.push(new Paragraph({ children: [text('Note', { bold: true, size: 20, color: BLUE })] }))
    noteParas.push(new Paragraph({ children: [text(quote.notes, { size: 16, color: GRAY })] }))
  }

  if (quote.termsAndConditions) {
    noteParas.push(emptyPara())
    noteParas.push(new Paragraph({ children: [text('Termini e Condizioni', { bold: true, size: 20, color: BLUE })] }))
    for (const line of quote.termsAndConditions.split('\n')) {
      noteParas.push(new Paragraph({ children: [text(line, { size: 14, color: GRAY })] }))
    }
  }

  const doc = new Document({
    sections: [
      {
        children: [...children, table, emptyPara(), ...totalParas, emptyPara(), legalPara, ...noteParas],
      },
    ],
  })

  return Packer.toBlob(doc)
}
