import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { useQuoteStore } from '@/stores/quoteStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useQuoteCalculations } from '@/hooks/useQuoteCalculations'
import { PdfQuoteDocument } from './PdfDocument'
import { generateDocx } from './DocxGenerator'
import { Button } from '@/components/ui/button'
import { FileText, FileDown, Loader2 } from 'lucide-react'

export function ExportButtons() {
  const quote = useQuoteStore((s) => s.quote)
  const settings = useSettingsStore((s) => s.settings)
  const calc = useQuoteCalculations()
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingDocx, setLoadingDocx] = useState(false)

  const filename = `preventivo-${quote.quoteNumber}`

  const handlePdf = async () => {
    setLoadingPdf(true)
    try {
      const blob = await pdf(
        <PdfQuoteDocument quote={quote} settings={settings} calc={calc} />
      ).toBlob()
      saveAs(blob, `${filename}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setLoadingPdf(false)
    }
  }

  const handleDocx = async () => {
    setLoadingDocx(true)
    try {
      const blob = await generateDocx(quote, settings, calc)
      saveAs(blob, `${filename}.docx`)
    } catch (err) {
      console.error('DOCX generation error:', err)
    } finally {
      setLoadingDocx(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button onClick={handlePdf} disabled={loadingPdf} className="gap-2">
        {loadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Scarica PDF
      </Button>
      <Button variant="outline" onClick={handleDocx} disabled={loadingDocx} className="gap-2">
        {loadingDocx ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        Scarica DOCX
      </Button>
    </div>
  )
}
