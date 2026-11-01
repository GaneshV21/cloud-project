function toPascalCase(segment) {
  return segment
    .split(/[-_]+/) // Splits by underscores or hyphens
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export function getPathSegmentsAsPascalCase(path) {
  return path.split("/").filter(Boolean).map(toPascalCase);
}

export function getStatus(item) {
  let obj = {
    running: "bg-green-200 text-green-700",
    active: "bg-green-200 text-green-700",
    available: "bg-green-200 text-green-700",
    stopped: "bg-red-200 text-red-700",
    inactive: "bg-red-200 text-red-700",
    "in-use": "bg-blue-200 text-blue-700",
  };

  return (
    <span
      className={`${obj[item.toLowerCase()]} text-sm py-1 px-2 font-bold rounded-full`}
    >
      {item}
    </span>
  );
}

// Avatar colors taken from the app's theme palette
const avatarColors = [
  "#5142D4",
  "#4338CA",
  "#6366F1",
  "#4F46E5",
  "#7C3AED",
  "#818CF8",
  "#312E81",
  "#F04438",
];

// Same name always gets the same color, so it doesn't flicker on re-render
export function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// Backend bookkeeping fields that shouldn't show in detail drawers
const HIDDEN_DETAIL_FIELDS = ["_id", "__v", "user_id", "project_id"];

const formatDetailValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === "object" ? JSON.stringify(v) : v)).join(", ") || "-";
  }
  if (value && typeof value === "object") return JSON.stringify(value);
  return value;
};

// API record -> what the detail drawer shows (no internal ids, arrays as readable text)
export function toDetail(record = {}) {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => !HIDDEN_DETAIL_FIELDS.includes(key))
      .map(([key, value]) => [key, formatDetailValue(value)])
  );
}
