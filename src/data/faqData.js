// Plain-language Q&A content, shared between the rendered FAQ page and its
// schema.org FAQPage JSON-LD (see FAQ.jsx) so both stay in sync.
export const faqData = [
  {
    question: "What is the Combat Tracker?",
    answer:
      "The Combat Tracker is a free web tool for Dungeons & Dragons 5e Game Masters. Add your player characters and monsters with their name, HP, AC, and initiative, and it automatically sorts everyone into turn order — so you can focus on running combat instead of doing the bookkeeping.",
  },
  {
    question: "Is the Combat Tracker free to use?",
    answer:
      "Yes. The tracker is completely free, with or without an account, and there are no ads, paywalls, or premium tiers.",
  },
  {
    question: "Do I need to create an account to use it?",
    answer:
      "No. You can add combatants, track initiative, HP, and conditions, and run a full encounter without ever signing in — that data is stored locally in your browser. An account is only needed if you want to save a reusable library of player characters or custom monsters across sessions and devices.",
  },
  {
    question: "What can I track for each combatant?",
    answer:
      "For every combatant you can track name, max HP, current HP, temporary HP, AC, initiative, advantage/disadvantage on their next roll, ongoing conditions, concentration, and death saving throws.",
  },
  {
    question: "How does initiative order work?",
    answer:
      "Enter each combatant's initiative roll when you add them, and the tracker automatically sorts the full list from highest to lowest. A \"Next Turn\" control steps through the order and highlights whoever is currently active.",
  },
  {
    question: "Where do the monsters in the Monster Library come from?",
    answer:
      "The built-in Monster Library uses creature stat blocks (name, AC, HP, and challenge rating) drawn from the D&D 5.1 System Reference Document (SRD), which Wizards of the Coast releases under the Creative Commons Attribution 4.0 license (CC-BY-4.0). Monsters are browsable one challenge rating at a time, from CR 0 up through CR 20.",
  },
  {
    question: "Can I add my own custom monsters?",
    answer:
      "Yes. If you're signed in, you can save your own custom monster stat blocks to a personal \"My Monsters\" library, separate from the built-in SRD library, and reuse them in any future encounter.",
  },
  {
    question: "Can I save player characters to reuse across sessions?",
    answer:
      "Yes. Signed-in users can save a player character's name, max HP, and AC to a personal Character Library, so you don't have to re-enter your party's stats every session.",
  },
  {
    question: "Does the tracker support status conditions like poisoned or stunned?",
    answer:
      "Yes. You can apply standard D&D 5e conditions to any combatant and remove them as they wear off, so the current status of everyone in the fight is visible at a glance.",
  },
  {
    question: "What is concentration tracking?",
    answer:
      "You can mark a combatant as concentrating on a spell. When they take damage, the tracker prompts a concentration check so you never forget to make (or ask for) that saving throw.",
  },
  {
    question: "How are death saving throws tracked?",
    answer:
      "When a combatant's HP drops to 0, the tracker shows death save success/failure pips you can click to record each roll, and flags the combatant as stable or dead once the outcome is decided.",
  },
  {
    question: "Is my saved data private?",
    answer:
      "Yes. Saved characters and custom monsters are stored per-account and are only ever readable by your own signed-in account. See the Privacy Policy for full details on what's collected and how it's used.",
  },
  {
    question: "Does the Combat Tracker work on mobile devices?",
    answer:
      "Yes, it runs in any modern mobile or desktop browser — no app install required.",
  },
  {
    question: "Is this the same thing as the Dungeons Not Dating app?",
    answer:
      "The Combat Tracker is a standalone tool built by the Dungeons Not Dating team, run separately from the main Dungeons Not Dating app, which helps you find people to play tabletop games with.",
  },
];
