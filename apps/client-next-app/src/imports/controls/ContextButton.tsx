interface ContextButtonProps {
  onClick: (x: number, y: number) => void;
  children: React.ReactNode;
}

export default function ContextButton(props: ContextButtonProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Content Area */}
      <div className="flex-1">{props.children}</div>

      {/* Context Button Container */}
      <div className="flex items-center justify-center">
        <button
          className="flex items-center justify-center rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const menuX = rect.right;
            const menuY = rect.bottom;
            props.onClick(menuX, menuY);
          }}
          aria-label="Context menu"
        >
          {/* Vertical Three Dots SVG */}
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
