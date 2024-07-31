
const MapsKey = process.env.GMAP_API_KEY;

export async function GET(request: Request) {
    if (!MapsKey) {
        return new Response('API key not found', { status: 500 });
    }

    return new Response(JSON.stringify({ APIKey: MapsKey }), {
        headers: { 'Content-Type': 'application/json' }
    });
}