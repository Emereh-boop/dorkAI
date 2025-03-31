export async function GET() {
    // List of predefined Google Dorking queries
    const queries = [
      "intitle:index of",
      "inurl:admin login",
      "filetype:pdf site:gov",
      "site:github.com password",
      "ext:sql intext:password",
      "site:pastebin.com database leak",
      "intitle:'webcam 7' inurl:8080",
    ];
  
    return new Response(JSON.stringify(queries), {
      headers: { "Content-Type": "application/json" },
    });
  }
  