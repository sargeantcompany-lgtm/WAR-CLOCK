export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function asArray(value: string[] | string) {
  return Array.isArray(value) ? value : [value];
}
