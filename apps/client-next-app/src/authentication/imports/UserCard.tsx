export interface UserCardProps {
  imgSrc: string;
  dispalyName: string;
  onClick: (x: number, y: number) => void;
}
export default function UserCard(props: UserCardProps) {
  return (
    <div onClick={(e) => props.onClick(e.clientX, e.clientY)}>
      <img
        src={props.imgSrc}
        alt={props.dispalyName}
        className="w-8 h-8 object-cover rounded-full"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if the image fails to load
          e.currentTarget.src =
            "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
        }}
      />
    </div>
  );
}
