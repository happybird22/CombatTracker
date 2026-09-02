import dndLogo from "../assets/dnd-logo-footer.png";

const Footer = () => (
  <footer className="site-footer">
    <a href="https://www.dungeonsnotdating.com" target="_blank" rel="noopener noreferrer">
      <img src={dndLogo} alt="Dungeons Not Dating" className="footer-logo" />
    </a>
    <p className="footer-tagline">
      Looking for more ways to play or more friends to play with? Check out
      Dungeons Not Dating to find your perfect party{" "}
      <a href="https://www.dungeonsnotdating.com" target="_blank" rel="noopener noreferrer">
        Here
      </a>
      .
    </p>
    <div className="footer-links">
      <a href="/faq" className="footer-privacy-link">
        FAQ
      </a>
      <span className="footer-link-divider">·</span>
      <a href="/privacy" className="footer-privacy-link">
        Privacy Policy
      </a>
    </div>
  </footer>
);

export default Footer;
