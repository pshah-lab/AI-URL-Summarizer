export const isValidURL = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
  
      // Allow only HTTP and HTTPS
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return false;
      }
  
      const hostname = parsedUrl.hostname.toLowerCase();
  
      // Block localhost
      if (hostname === "localhost") {
        return false;
      }
  
      // Block IPv4 private & loopback ranges
      if (isPrivateIP(hostname)) {
        return false;
      }
  
      return true;
    } catch {
      // Invalid URL format
      return false;
    }
  };
  
  /**
   * Checks if an IP address is private or loopback
   */
  const isPrivateIP = (host: string): boolean => {
    if (host === "::1") return true;
  
    const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(host)) return false;
  
    const parts = host.split(".").map(Number);
  
    if (parts.length !== 4) return false;
  
    const [a, b] = parts;
    if (b === undefined) return false;

  
    return (
      a === 10 ||
      a === 127 ||
      (a === 192 && b === 168) ||
      (a === 172 && b >= 16 && b <= 31)
    );
  };