export async function GET(request, { params }) {
  console.log(params.term)
  const res = await fetch(`http://${process.env.DATA_API_IPADDRESS}/geopoints/search/navaids/${params.term}`, {
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();
  console.log(data)

  return Response.json({ data });
}
