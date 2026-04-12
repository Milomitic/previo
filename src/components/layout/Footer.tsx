export function Footer() {
  return (
    <footer className="border-t bg-card/50 py-2 px-3 lg:px-5">
      <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground">
        <span>Previo — Generatore Preventivi</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
