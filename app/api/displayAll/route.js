export async function GET() {
  const res = await fetch(`http://${process.env.DATA_API_IPADDRESS}/flight-manager/displayAll`, {
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.DATA_API_KEY,
    },
    cache: 'no-store' // due to Nexjs max cache limit of 2MB
  });
  const data = await res.json();

  return Response.json({ data });
}
