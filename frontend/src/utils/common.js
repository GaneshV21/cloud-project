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
