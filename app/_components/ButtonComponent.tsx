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
            font-bold
            text-[15px]
            px-6
            py-2
            text-lilac
            bg-shakespeare
            hover:bg-shakespeare/70
            transition-colors
            duration-200
            border-none
            shadow-sm
            `}
          onClick = { () => passingFunction?.()}
  >
    {text}
  </button>
);

export default ButtonComponent;
