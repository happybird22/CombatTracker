export const CONDITIONS = [
  { value: "blinded", label: "Blinded" },
  { value: "charmed", label: "Charmed" },
  { value: "deafened", label: "Deafened" },
  { value: "frightened", label: "Frightened" },
  { value: "grappled", label: "Grappled" },
  { value: "incapacitated", label: "Incapacitated" },
  { value: "paralyzed", label: "Paralyzed" },
  { value: "petrified", label: "Petrified" },
  { value: "poisoned", label: "Poisoned" },
  { value: "prone", label: "Prone" },
  { value: "restrained", label: "Restrained" },
  { value: "stunned", label: "Stunned" },
  { value: "unconscious", label: "Unconscious" },
  { value: "blessed", label: "Blessed" },
  { value: "inspiration", label: "Has Inspiration" },
  { value: "huntersMark", label: "Hunter’s Mark" },
];

export const conditionLabel = (value) =>
  CONDITIONS.find((c) => c.value === value)?.label || value;
