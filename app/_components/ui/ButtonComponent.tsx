interface ButtonComponentProps {
  text:string,
  passingFunction?: () => void
}

const ButtonComponent = ({
  text,
  passingFunction
}: ButtonComponentProps) => (
  <button className={`
            cursor-pointer
            rounded-full
            text-[15px]
            px-6
            py-2
            text-lilac
            bg-scampi
            hover:bg-scampi/70
            transition-colors
            duration-200
            border-none
            shadow-sm
            font-semibold
            `}
          onClick = { () => passingFunction?.()}
  >
    {text}
  </button>
);

export default ButtonComponent;
