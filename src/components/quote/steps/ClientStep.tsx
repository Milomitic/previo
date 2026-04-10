import { useQuoteStore } from '@/stores/quoteStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function ClientStep() {
  const client = useQuoteStore((s) => s.quote.client)
  const setClient = useQuoteStore((s) => s.setClient)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Dati del cliente</h2>
        <p className="text-sm text-muted-foreground">
          Inserisci le informazioni del committente
        </p>
      </div>

      {/* Client type */}
      <RadioGroup
        value={client.type}
        onValueChange={(v) => setClient({ type: v as 'persona' | 'azienda' })}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="azienda" id="azienda" />
          <Label htmlFor="azienda">Azienda</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="persona" id="persona" />
          <Label htmlFor="persona">Persona Fisica</Label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="name">
            {client.type === 'azienda' ? 'Ragione Sociale' : 'Nome e Cognome'}
          </Label>
          <Input
            id="name"
            value={client.name}
            onChange={(e) => setClient({ name: e.target.value })}
            placeholder={client.type === 'azienda' ? 'Azienda S.r.l.' : 'Mario Rossi'}
          />
        </div>

        {client.type === 'azienda' && (
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="contact">Referente</Label>
            <Input
              id="contact"
              value={client.contactPerson}
              onChange={(e) => setClient({ contactPerson: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            id="address"
            value={client.address}
            onChange={(e) => setClient({ address: e.target.value })}
            placeholder="Via Roma, 1"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="city">Citta</Label>
          <Input
            id="city"
            value={client.city}
            onChange={(e) => setClient({ city: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="province">Prov.</Label>
            <Input
              id="province"
              value={client.province}
              onChange={(e) => setClient({ province: e.target.value })}
              maxLength={2}
              placeholder="RM"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cap">CAP</Label>
            <Input
              id="cap"
              value={client.cap}
              onChange={(e) => setClient({ cap: e.target.value })}
              maxLength={5}
              placeholder="00100"
            />
          </div>
        </div>

        {client.type === 'azienda' && (
          <div className="space-y-1">
            <Label htmlFor="piva">Partita IVA</Label>
            <Input
              id="piva"
              value={client.partitaIva}
              onChange={(e) => setClient({ partitaIva: e.target.value })}
              maxLength={11}
              placeholder="12345678901"
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="cf">Codice Fiscale</Label>
          <Input
            id="cf"
            value={client.codiceFiscale}
            onChange={(e) => setClient({ codiceFiscale: e.target.value.toUpperCase() })}
            maxLength={16}
            placeholder="RSSMRA80A01H501Z"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={client.email}
            onChange={(e) => setClient({ email: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            type="tel"
            value={client.phone}
            onChange={(e) => setClient({ phone: e.target.value })}
          />
        </div>

        {client.type === 'azienda' && (
          <>
            <div className="space-y-1">
              <Label htmlFor="pec">PEC</Label>
              <Input
                id="pec"
                type="email"
                value={client.pec}
                onChange={(e) => setClient({ pec: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sdi">Codice SDI</Label>
              <Input
                id="sdi"
                value={client.codiceDestinatario}
                onChange={(e) => setClient({ codiceDestinatario: e.target.value.toUpperCase() })}
                maxLength={7}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
