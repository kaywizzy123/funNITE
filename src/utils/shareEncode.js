function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + padding);
}

export function encodeShareData({ gameName, format, mode, rounds }) {
  const json = JSON.stringify({ gameName, format, mode, rounds });
  return base64UrlEncode(encodeURIComponent(json));
}

export function decodeShareData(encoded) {
  try {
    const json = decodeURIComponent(base64UrlDecode(encoded));
    const data = JSON.parse(json);
    if (!data || !Array.isArray(data.rounds)) return null;
    return data;
  } catch {
    return null;
  }
}
