interface TriangleButtonProps {
  triangleRotation: string;
  onClick: () => void;
}

export const TriangleButton = ({ triangleRotation, onClick }: TriangleButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="text-lilac hover:text-lilac/70 cursor-pointer"
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
