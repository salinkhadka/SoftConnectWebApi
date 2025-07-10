export default function ConversationCard({ user, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer border-b">
      <img src={user.profilePhoto || "/default-avatar.png"} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-gray-600 truncate w-52">{user.lastMessage}</p>
      </div>
    </div>
  );
}
