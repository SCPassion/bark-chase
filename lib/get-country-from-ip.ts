/**
 * Resolve current country from request IP (e.g. via ipapi.co).
 * Call at click time so each click is attributed to where the user is now.
 */
export async function getCountryFromIp(): Promise<{
  countryCode: string;
  countryName: string;
} | null> {
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
