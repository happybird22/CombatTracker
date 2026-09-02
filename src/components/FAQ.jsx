import { faqData } from "../data/faqData";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const FAQ = () => (
  <div className="faq-page">
    {/* Structured data so search engines and AI answer engines can parse
        these as discrete Q&A pairs (schema.org FAQPage). */}
    <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

    <a href="/" className="back-link">← Back to the Combat Tracker</a>

    <h1>Frequently Asked Questions</h1>
    <p className="faq-intro">
      Answers to common questions about the D&amp;D 5e Combat Tracker —
      what it does, what's free, and how your data is handled.
    </p>

    <dl className="faq-list">
      {faqData.map(({ question, answer }) => (
        <div className="faq-item" key={question}>
          <dt>{question}</dt>
          <dd>{answer}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default FAQ;
