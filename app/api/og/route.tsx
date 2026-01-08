import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
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
        }}
      >
        <img
          src="https://taller-dels-sentits.vercel.app/logo-taller.jpg"
          alt="Taller dels Sentits"
          width="300"
          height="300"
          style={{ marginBottom: '40px' }}
        />
        <h1
          style={{
            fontSize: 48,
            color: '#6b8ac6', // shakespeare
            textAlign: 'center',
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.3,
            maxWidth: '900px',
          }}
        >
          Centre d'artteràpia i expressió plàstica a Vilanova i la Geltrú
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}