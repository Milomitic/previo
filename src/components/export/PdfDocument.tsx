import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
import type { AppSettings } from '@/types/settings'
import type { QuoteCalculation } from '@/utils/calculations'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { getServiceType } from '@/data/services'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 },
  ],
})

const BLUE = '#1e3a5f'
const GRAY = '#64748b'
const LIGHT_GRAY = '#f1f5f9'

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9, padding: 50, color: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 50, height: 50, objectFit: 'contain' },
  headerRight: { textAlign: 'right' },
  profName: { fontSize: 14, fontWeight: 700, color: BLUE },
  profDetail: { fontSize: 8, color: GRAY, marginTop: 1 },
  divider: { height: 1, backgroundColor: BLUE, marginVertical: 12 },
  title: { fontSize: 18, fontWeight: 700, color: BLUE, marginBottom: 4 },
  metaRow: { flexDirection: 'row', gap: 30, marginBottom: 15 },
  metaItem: { fontSize: 8, color: GRAY },
  metaValue: { fontWeight: 600, color: '#0f172a' },
  sectionTitle: { fontSize: 10, fontWeight: 600, color: BLUE, marginBottom: 6, marginTop: 12 },
  clientBlock: { marginBottom: 12, padding: 10, backgroundColor: LIGHT_GRAY, borderRadius: 4 },
  clientLabel: { fontSize: 8, color: GRAY },
  clientName: { fontSize: 11, fontWeight: 600, marginTop: 2 },
  clientDetail: { fontSize: 8, color: GRAY, marginTop: 1 },
  objectLine: { fontSize: 10, fontWeight: 500, marginBottom: 12 },
  table: { marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: BLUE, borderRadius: 2, paddingVertical: 5, paddingHorizontal: 6 },
  tableHeaderCell: { color: '#ffffff', fontSize: 8, fontWeight: 600 },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  tableRowAlt: { backgroundColor: '#f8fafc' },
  tableCell: { fontSize: 8 },
  colDesc: { flex: 1 },
  colQty: { width: 40, textAlign: 'right' },
  colPrice: { width: 70, textAlign: 'right' },
  colTotal: { width: 70, textAlign: 'right' },
  totalsBlock: { marginTop: 8, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 220, paddingVertical: 2 },
  totalLabel: { fontSize: 8, color: GRAY },
  totalValue: { fontSize: 8, fontWeight: 500 },
  totalDivider: { height: 0.5, backgroundColor: GRAY, width: 220, marginVertical: 3 },
  grandTotalLabel: { fontSize: 11, fontWeight: 700, color: BLUE },
  grandTotalValue: { fontSize: 11, fontWeight: 700, color: BLUE },
  notes: { marginTop: 15, fontSize: 8, color: GRAY, lineHeight: 1.5 },
  terms: { marginTop: 10, fontSize: 7, color: GRAY, lineHeight: 1.4 },
  legalNote: { marginTop: 8, fontSize: 7, color: GRAY },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', fontSize: 7, color: GRAY },
})

interface PdfDocumentProps {
  quote: Quote
  settings: AppSettings
  calc: QuoteCalculation
}

export function PdfQuoteDocument({ quote, settings, calc }: PdfDocumentProps) {
  const serviceType = quote.service
    ? getServiceType(quote.service.categoryId, quote.service.typeId)
    : null

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {settings.professional.logo && (
              <Image src={settings.professional.logo} style={s.logo} />
            )}
            <View>
              <Text style={s.profName}>{settings.professional.name || 'Nome Professionista'}</Text>
              <Text style={s.profDetail}>{settings.professional.title}</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            {settings.professional.address && <Text style={s.profDetail}>{settings.professional.address}</Text>}
            {settings.professional.city && (
              <Text style={s.profDetail}>
                {settings.professional.cap} {settings.professional.city} ({settings.professional.province})
              </Text>
            )}
            {settings.professional.codiceFiscale && <Text style={s.profDetail}>C.F.: {settings.professional.codiceFiscale}</Text>}
            {settings.professional.email && <Text style={s.profDetail}>{settings.professional.email}</Text>}
            {settings.professional.phone && <Text style={s.profDetail}>Tel: {settings.professional.phone}</Text>}
            {settings.professional.pec && <Text style={s.profDetail}>PEC: {settings.professional.pec}</Text>}
          </View>
        </View>

        <View style={s.divider} />

        {/* Title */}
        <Text style={s.title}>PREVENTIVO</Text>
        <View style={s.metaRow}>
          <Text style={s.metaItem}>N.: <Text style={s.metaValue}>{quote.quoteNumber}</Text></Text>
          <Text style={s.metaItem}>Data: <Text style={s.metaValue}>{formatDate(quote.createdAt)}</Text></Text>
          <Text style={s.metaItem}>Validita: <Text style={s.metaValue}>{formatDate(quote.validUntil)}</Text></Text>
        </View>

        {/* Client */}
        <View style={s.clientBlock}>
          <Text style={s.clientLabel}>Spett.le</Text>
          <Text style={s.clientName}>{quote.client.name || '---'}</Text>
          {quote.client.address && <Text style={s.clientDetail}>{quote.client.address}</Text>}
          {quote.client.city && (
            <Text style={s.clientDetail}>
              {quote.client.cap} {quote.client.city} ({quote.client.province})
            </Text>
          )}
          {quote.client.partitaIva && <Text style={s.clientDetail}>P.IVA: {quote.client.partitaIva}</Text>}
          {quote.client.codiceFiscale && <Text style={s.clientDetail}>C.F.: {quote.client.codiceFiscale}</Text>}
          {quote.client.email && <Text style={s.clientDetail}>{quote.client.email}</Text>}
        </View>

        {/* Object */}
        {serviceType && (
          <Text style={s.objectLine}>
            Oggetto: {serviceType.label} — {quote.pages} pagine
          </Text>
        )}

        {/* Items table */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, s.colDesc]}>Descrizione</Text>
            <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeaderCell, s.colPrice]}>Prezzo Unit.</Text>
            <Text style={[s.tableHeaderCell, s.colTotal]}>Importo</Text>
          </View>
          {quote.lineItems.map((item, i) => (
            <View key={item.id} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tableCell, s.colDesc]}>{item.description}</Text>
              <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.tableCell, s.colPrice]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[s.tableCell, s.colTotal]}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsBlock}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotale</Text>
            <Text style={s.totalValue}>{formatCurrency(calc.subtotal)}</Text>
          </View>
          {calc.discountAmount > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Sconto ({quote.discount.percentage}%)</Text>
              <Text style={s.totalValue}>-{formatCurrency(calc.discountAmount)}</Text>
            </View>
          )}
          {calc.urgencySurcharge > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Maggiorazione urgenza</Text>
              <Text style={s.totalValue}>+{formatCurrency(calc.urgencySurcharge)}</Text>
            </View>
          )}
          <View style={s.totalDivider} />
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Compenso lordo</Text>
            <Text style={s.totalValue}>{formatCurrency(calc.compensoLordo)}</Text>
          </View>
          {calc.ritenutaAcconto > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Ritenuta d'acconto (20%)</Text>
              <Text style={s.totalValue}>-{formatCurrency(calc.ritenutaAcconto)}</Text>
            </View>
          )}
          {calc.marcaDaBollo > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Marca da bollo</Text>
              <Text style={s.totalValue}>{formatCurrency(calc.marcaDaBollo)}</Text>
            </View>
          )}
          <View style={s.totalDivider} />
          <View style={s.totalRow}>
            <Text style={s.grandTotalLabel}>NETTO A PAGARE</Text>
            <Text style={s.grandTotalValue}>{formatCurrency(calc.totaleDovuto)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <>
            <Text style={s.sectionTitle}>Note</Text>
            <Text style={s.notes}>{quote.notes}</Text>
          </>
        )}

        {/* Legal notes */}
        <Text style={s.legalNote}>
          Prestazione occasionale ai sensi dell'art. 2222 e seguenti del Codice Civile.
          Operazione fuori campo IVA ai sensi dell'art. 5 DPR 633/72.
          {quote.taxConfig.ritenutaAcconto && ' Ritenuta d\'acconto 20% ai sensi dell\'art. 25 DPR 600/73.'}
          {calc.marcaDaBollo > 0 && ' Imposta di bollo assolta sull\'originale - 2,00 EUR.'}
        </Text>

        {/* Terms */}
        {quote.termsAndConditions && (
          <>
            <Text style={s.sectionTitle}>Termini e Condizioni</Text>
            <Text style={s.terms}>{quote.termsAndConditions}</Text>
          </>
        )}

        {/* Footer */}
        <Text style={s.footer}>
          {settings.professional.name}
          {settings.professional.codiceFiscale ? ` — C.F.: ${settings.professional.codiceFiscale}` : ''}
          {settings.professional.email ? ` — ${settings.professional.email}` : ''}
        </Text>
      </Page>
    </Document>
  )
}
