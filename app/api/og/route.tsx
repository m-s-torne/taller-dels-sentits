import { ImageResponse } from 'next/og';

export async function GET() {
  // Cargar tipografía Playfair Display
  const playfairFont = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300&display=swap')
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fffaf6', // bg-lilac
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px',
          fontFamily: '"Playfair Display", serif',
        }}
      >
        <img
          src="https://taller-dels-sentits.vercel.app/logo-taller-dels-sentits.png"
          alt="Taller dels Sentits"
          width="500"
          height="272"
          style={{ marginBottom: '40px' }}
        />
        <h1
          style={{
            fontSize: 52,
            color: '#6b8ac6', // text-shakespeare
            textAlign: 'center',
            margin: 0,
            fontWeight: 300, // font-light
            lineHeight: 1.4,
            maxWidth: '950px',
            letterSpacing: '0.05em',
          }}
        >
          Centre d'artteràpia i expressió plàstica a Vilanova i la Geltrú
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Playfair Display',
          data: await playfairFont,
          weight: 300,
          style: 'normal',
        },
      ],
    },
  );
}