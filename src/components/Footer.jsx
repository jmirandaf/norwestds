export default function Footer() {
  return (
    <footer className="footer">
      <div className="container row">
        <div className="col">
          <img src="/logo.png" alt="Norwest" height="24"/>
          <p>© {new Date().getFullYear()} Norwest Dynamic Systems</p>
        </div>
        <div className="col">
          <h4>Contacto</h4>
          <p>Email: ventas@norwestds.com</p>
          <p>Tel: +52 664-685-3430</p>
        </div>
      </div>
    </footer>
  );
}