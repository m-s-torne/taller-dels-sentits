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
            font-medium
            px-6
            py-2
            text-white
            bg-[#7B8BC7]
            hover:bg-[#6B7DB8]
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
