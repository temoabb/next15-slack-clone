import { Id } from "../../../../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation: React.FC<ConversationProps> = () => {
  return <div>Converstion</div>;
};
