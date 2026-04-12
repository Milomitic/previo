import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
import type { AppSettings } from '@/types/settings'
import type { QuoteCalculation } from '@/utils/calculations'
import { formatCurrency, formatDate } from '@/utils/formatting'
import { getServiceType } from '@/data/services'
import { PHASES } from '@/data/phases'

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
  profName: { fontSize: 14, fontWeight: 700, color: BLUE },
  profDetail: { fontSize: 8, color: GRAY, marginTop: 1 },
  headerRight: { textAlign: 'right' },
  divider: { height: 1, backgroundColor: BLUE, marginVertical: 12 },
  title: { fontSize: 18, fontWeight: 700, color: BLUE, marginBottom: 4 },
  metaRow: { flexDirection: 'row', gap: 30, marginBottom: 15 },
  metaItem: { fontSize: 8, color: GRAY },
  metaValue: { fontWeight: 600, color: '#0f172a' },
  sectionTitle: { fontSize: 10, fontWeight: 600, color: BLUE, marginBottom: 6, marginTop: 14 },
  clientBlock: { marginBottom: 12, padding: 10, backgroundColor: LIGHT_GRAY, borderRadius: 4 },
  clientLabel: { fontSize: 8, color: GRAY },
  clientName: { fontSize: 11, fontWeight: 600, marginTop: 2 },
  clientDetail: { fontSize: 8, color: GRAY, marginTop: 1 },
  objectLine: { fontSize: 10, fontWeight: 500, marginBottom: 12 },
  // Phase-based table
  phaseBlock: { marginBottom: 8 },
  phaseHeader: { flexDirection: 'row', backgroundColor: BLUE, borderRadius: 2, paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between' },
  phaseTitle: { color: '#ffffff', fontSize: 9, fontWeight: 600 },
  phasePrice: { color: '#ffffff', fontSize: 9, fontWeight: 600 },
  phaseDesc: { fontSize: 7, color: GRAY, paddingHorizontal: 6, paddingTop: 3, paddingBottom: 2 },
  activityRow: { flexDirection: 'row', paddingVertical: 2, paddingHorizontal: 6 },
  activityBullet: { fontSize: 7, color: GRAY, width: 8 },
  activityLabel: { fontSize: 7, color: '#333' },
  // Extras table
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  extraLabel: { fontSize: 8 },
  extraPrice: { fontSize: 8, fontWeight: 500 },
  // Totals
  totalsBlock: { marginTop: 10, alignItems: 'flex-end' },
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

  const phaseItems = quote.lineItems.filter((li) => li.category === 'phase')
  const extraItems = quote.lineItems.filter((li) => li.category === 'extra' || li.category === 'addon' || li.category === 'consulting' || li.category === 'custom')

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
          </View>
        </View>

        <View style={s.divider} />

        <Text style={s.title}>PREVENTIVO</Text>
        <View style={s.metaRow}>
          <Text style={s.metaItem}>N.: <Text style={s.metaValue}>{quote.quoteNumber}</Text></Text>
          <Text style={s.metaItem}>Data: <Text style={s.metaValue}>{formatDate(quote.createdAt)}</Text></Text>
          <Text style={s.metaItem}>Validità: <Text style={s.metaValue}>{formatDate(quote.validUntil)}</Text></Text>
        </View>

        {/* Client */}
        <View style={s.clientBlock}>
          <Text style={s.clientLabel}>Spett.le</Text>
          <Text style={s.clientName}>{quote.client.name || '---'}</Text>
          {quote.client.address && <Text style={s.clientDetail}>{quote.client.address}</Text>}
          {quote.client.city && (
            <Text style={s.clientDetail}>{quote.client.cap} {quote.client.city} ({quote.client.province})</Text>
          )}
          {quote.client.partitaIva && <Text style={s.clientDetail}>P.IVA: {quote.client.partitaIva}</Text>}
          {quote.client.codiceFiscale && <Text style={s.clientDetail}>C.F.: {quote.client.codiceFiscale}</Text>}
          {quote.client.email && <Text style={s.clientDetail}>{quote.client.email}</Text>}
        </View>

        {serviceType && (
          <Text style={s.objectLine}>Oggetto: {serviceType.label}</Text>
        )}

        {/* Phase-based items */}
        {phaseItems.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Attività incluse</Text>
            {phaseItems.map((item) => {
              const phaseTemplate = PHASES.find((p) => p.id === item.phaseId)
              const quotePhase = quote.phases.find((p) => p.phaseId === item.phaseId)
              const enabledActivities = quotePhase?.activities
                .filter((a) => a.enabled)
                .map((a) => phaseTemplate?.activities.find((at) => at.id === a.activityId)?.label)
                .filter(Boolean) || []

              return (
                <View key={item.id} style={s.phaseBlock}>
                  <View style={s.phaseHeader}>
                    <Text style={s.phaseTitle}>{item.description}</Text>
                    <Text style={s.phasePrice}>{formatCurrency(item.unitPrice)}</Text>
                  </View>
                  {phaseTemplate && (
                    <Text style={s.phaseDesc}>{phaseTemplate.description}</Text>
                  )}
                  {enabledActivities.map((activity, i) => (
                    <View key={i} style={s.activityRow}>
                      <Text style={s.activityBullet}>•</Text>
                      <Text style={s.activityLabel}>{activity}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </>
        )}

        {/* Extra items */}
        {extraItems.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Extra opzionali</Text>
            {extraItems.map((item) => (
              <View key={item.id} style={s.extraRow}>
                <Text style={s.extraLabel}>
                  {item.description}{item.quantity > 1 ? ` (x${item.quantity})` : ''}
                </Text>
                <Text style={s.extraPrice}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
              </View>
            ))}
          </>
        )}

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

        {quote.notes && (
          <>
            <Text style={s.sectionTitle}>Note</Text>
            <Text style={s.notes}>{quote.notes}</Text>
          </>
        )}

        <Text style={s.legalNote}>
          Prestazione occasionale ai sensi dell'art. 2222 e seguenti del Codice Civile.
          Operazione fuori campo IVA ai sensi dell'art. 5 DPR 633/72.
          {quote.taxConfig.ritenutaAcconto && " Ritenuta d'acconto 20% ai sensi dell'art. 25 DPR 600/73."}
          {calc.marcaDaBollo > 0 && " Imposta di bollo assolta sull'originale - 2,00 EUR."}
        </Text>

        {quote.termsAndConditions && (
          <>
            <Text style={s.sectionTitle}>Termini e Condizioni</Text>
            <Text style={s.terms}>{quote.termsAndConditions}</Text>
          </>
        )}

        <Text style={s.footer}>
          {settings.professional.name}
          {settings.professional.codiceFiscale ? ` — C.F.: ${settings.professional.codiceFiscale}` : ''}
          {settings.professional.email ? ` — ${settings.professional.email}` : ''}
        </Text>
      </Page>
    </Document>
  )
}
