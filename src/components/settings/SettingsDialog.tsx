import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/settingsStore'
import { Upload, X } from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const settings = useSettingsStore((s) => s.settings)
  const updateProfessional = useSettingsStore((s) => s.updateProfessional)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const updateGoogleSearch = useSettingsStore((s) => s.updateGoogleSearch)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfessional({ logo: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Impostazioni</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="professional" className="mt-2">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="professional">Profilo</TabsTrigger>
            <TabsTrigger value="pricing">Prezzi</TabsTrigger>
            <TabsTrigger value="terms">Termini</TabsTrigger>
            <TabsTrigger value="google">Google API</TabsTrigger>
          </TabsList>

          {/* Professional data */}
          <TabsContent value="professional" className="space-y-4 mt-4">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {settings.professional.logo ? (
                  <div className="relative">
                    <img src={settings.professional.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg border" />
                    <button
                      onClick={() => updateProfessional({ logo: '' })}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label>Nome completo</Label>
                <Input value={settings.professional.name} onChange={(e) => updateProfessional({ name: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Titolo</Label>
                <Input value={settings.professional.title} onChange={(e) => updateProfessional({ title: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Indirizzo</Label>
                <Input value={settings.professional.address} onChange={(e) => updateProfessional({ address: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Città</Label>
                <Input value={settings.professional.city} onChange={(e) => updateProfessional({ city: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Prov.</Label>
                  <Input value={settings.professional.province} onChange={(e) => updateProfessional({ province: e.target.value })} maxLength={2} />
                </div>
                <div className="space-y-1">
                  <Label>CAP</Label>
                  <Input value={settings.professional.cap} onChange={(e) => updateProfessional({ cap: e.target.value })} maxLength={5} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Codice Fiscale</Label>
                <Input value={settings.professional.codiceFiscale} onChange={(e) => updateProfessional({ codiceFiscale: e.target.value.toUpperCase() })} maxLength={16} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={settings.professional.email} onChange={(e) => updateProfessional({ email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>PEC</Label>
                <Input type="email" value={settings.professional.pec} onChange={(e) => updateProfessional({ pec: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Telefono</Label>
                <Input type="tel" value={settings.professional.phone} onChange={(e) => updateProfessional({ phone: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Sito web</Label>
                <Input value={settings.professional.website} onChange={(e) => updateProfessional({ website: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>IBAN</Label>
                <Input value={settings.professional.iban} onChange={(e) => updateProfessional({ iban: e.target.value })} />
              </div>
            </div>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tariffa oraria consulenza (EUR)</Label>
                <Input
                  type="number"
                  value={settings.consultingHourlyRate}
                  onChange={(e) => updateSettings({ consultingHourlyRate: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Maggiorazione urgenza (%)</Label>
                <Input
                  type="number"
                  value={settings.urgencySurchargePercent}
                  onChange={(e) => updateSettings({ urgencySurchargePercent: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Sconto "Prezzo Amico" (%)</Label>
                <Input
                  type="number"
                  value={settings.friendDiscountPercent}
                  onChange={(e) => updateSettings({ friendDiscountPercent: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Validità preventivo (giorni)</Label>
                <Input
                  type="number"
                  value={settings.defaultValidityDays}
                  onChange={(e) => updateSettings({ defaultValidityDays: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Materiale grafico (EUR)</Label>
                <Input
                  type="number"
                  value={settings.graphicsCost}
                  onChange={(e) => updateSettings({ graphicsCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Dominio e hosting annuale (EUR)</Label>
                <Input
                  type="number"
                  value={settings.domainHostingCost}
                  onChange={(e) => updateSettings({ domainHostingCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Prefisso numero preventivo</Label>
                <Input
                  value={settings.quoteNumberPrefix}
                  onChange={(e) => updateSettings({ quoteNumberPrefix: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Prossimo numero</Label>
                <Input
                  type="number"
                  value={settings.nextQuoteNumber}
                  onChange={(e) => updateSettings({ nextQuoteNumber: Number(e.target.value) })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Terms */}
          <TabsContent value="terms" className="space-y-4 mt-4">
            <div className="space-y-1">
              <Label>Termini e condizioni predefiniti</Label>
              <Textarea
                value={settings.defaultTerms}
                onChange={(e) => updateSettings({ defaultTerms: e.target.value })}
                rows={12}
                className="text-xs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                import('@/data/terms').then(({ DEFAULT_TERMS }) => {
                  updateSettings({ defaultTerms: DEFAULT_TERMS })
                })
              }}
            >
              Ripristina default
            </Button>
          </TabsContent>

          {/* Google Search API */}
          <TabsContent value="google" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Configura Google Custom Search API per suggerimenti di prezzo basati sul mercato.
              Gratuito fino a 100 query/giorno.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Google API Key</Label>
                <Input
                  type="password"
                  value={settings.googleSearch.apiKey}
                  onChange={(e) => updateGoogleSearch({ apiKey: e.target.value })}
                  placeholder="AIza..."
                />
              </div>
              <div className="space-y-1">
                <Label>Custom Search Engine ID</Label>
                <Input
                  value={settings.googleSearch.searchEngineId}
                  onChange={(e) => updateGoogleSearch({ searchEngineId: e.target.value })}
                  placeholder="abc123..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
