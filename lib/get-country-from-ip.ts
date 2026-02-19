/**
 * Resolve current country from server headers first (Vercel), then fallback to ipapi.
 * Call at click time so each click is attributed to where the user is now.
 */
export async function getCountryFromIp(): Promise<{
  countryCode: string;
  countryName: string;
} | null> {
  try {
    const res = await fetch("/api/geo-country", {
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as {
        countryCode?: string;
        countryName?: string;
      };
      const code = data.countryCode ?? "";
      const name = data.countryName ?? code;
      if (code) return { countryCode: code, countryName: name };
    }
  } catch {
    // fallback below
  }

  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      country_code?: string;
      country_name?: string;
    };
    const code = data.country_code ?? "";
    const name = data.country_name ?? code;
    if (!code) return null;
    return { countryCode: code, countryName: name };
  } catch {
    return null;
  }
}
