interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  className?: string;
  active: boolean;
}
export default function Button(props: ButtonProps) {
  return (
    <button
      title={props.title}
      onClick={props.onClick}
      className={`p-2 flex flex-col items-center rounded-lg border border-emerald-500/40  text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-200 ${
        props.className
      }
        ${props.active && " text-emerald-400 shadow-md shadow-emerald-500/5"} 
      `}
      type="button"
    >
      {props.children}
    </button>
  );
}
