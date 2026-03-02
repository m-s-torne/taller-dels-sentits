const buttonClassName = `
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
            text-lilac!
            `;

type ButtonComponentProps =
  | { text: string; passingFunction?: () => void; href?: never; download?: never }
  | { text: string; href: string; download?: string; passingFunction?: never };

const ButtonComponent = (props: ButtonComponentProps) => {
  if (props.href) {
    return (
      <a
        href={props.href}
        download={props.download}
        className={buttonClassName}
      >
        {props.text}
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={() => props.passingFunction?.()}
    >
      {props.text}
    </button>
  );
};

export default ButtonComponent;
