import dndLogo from "../assets/High Resolution-01.jpg";

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
    <a href="/privacy" className="footer-privacy-link">
      Privacy Policy
    </a>
  </footer>
);

export default Footer;
