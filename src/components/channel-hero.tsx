import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

const ChannelHero: React.FC<ChannelHeroProps> = ({ name, creationTime }) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="font-bold text-2xl flex items-center mb-2"># {name}</p>
      <p className="font-normal text-slate-800 mb-4">
        This channel was created {format(creationTime, "MMMM do, yyyy")}. This
        is the very beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};

export default ChannelHero;
