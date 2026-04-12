export function Footer() {
  return (
    <footer className="border-t bg-card/50 py-3 px-4 lg:px-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Previo — Generatore Preventivi</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
