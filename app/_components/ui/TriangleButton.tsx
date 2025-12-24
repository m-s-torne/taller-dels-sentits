interface TriangleButtonProps {
  triangleRotation: string;
  onClick: () => void;
  color?: 'lilac' | 'scampi' | 'shakespeare';
}

export const TriangleButton = ({ triangleRotation, onClick, color = 'lilac' }: TriangleButtonProps) => {
  const colorClasses = {
    lilac: 'text-lilac hover:text-lilac/70',
    scampi: 'text-scampi hover:text-scampi/70',
    shakespeare: 'text-shakespeare hover:text-shakespeare/70'
  };

  return (
    <button 
      onClick={onClick}
      className={`${colorClasses[color]} cursor-pointer`}
    >
      <div 
        className="transform transition-all duration-300 ease-out hover:scale-110"
        style={{
          transform: triangleRotation
        }}
      >
        {/* Triángulo hacia abajo - relleno sólido */}
        <svg 
          width="40" 
          height="16" 
          viewBox="0 0 40 16" 
          fill="currentColor" 
          className="mx-auto"
        >
          <path d="M20 14L38 2L2 2Z" />
        </svg>
      </div>
    </button>
  );
};
