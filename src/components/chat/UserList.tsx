import { User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserListProps {
  users: User[];
  activeUser: User;
  onUserSelect: (user: User) => void;
}

export const UserList = ({ users, activeUser, onUserSelect }: UserListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors ${
              activeUser.id === user.id ? "bg-gray-200" : ""
            }`}
            onClick={() => onUserSelect(user)}
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};