import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useConversations, useMarkAsRead } from "../hooks/messagehooks";
import { AuthContext } from "../auth/AuthProvider.jsx";
import { getBackendImageUrl } from "../utils/getBackendImageUrl.js";
import { formatDistanceToNow } from "date-fns";

export default function InboxPage() {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?._id;
  const navigate = useNavigate();

  const { data: conversations, isLoading, refetch } = useConversations(userId);
  const markAsReadMutation = useMarkAsRead(userId);

  if (!userId) return <p>Loading user info...</p>;
  if (isLoading) return <p>Loading inbox...</p>;

  const handleClick = (otherUserId) => {
    markAsReadMutation.mutate(
      { otherUserId },
      {
        onSuccess: () => {
          refetch();
          navigate(`/${otherUserId}/message`);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Inbox</h2>
      {conversations?.length === 0 && <p>No conversations yet.</p>}

      {conversations?.map((conv) => {
        const isUnread = !conv.lastMessageIsRead;
        const isSender = conv.lastMessageSenderId === userId;
        const isReceiver = !isSender;

        // No background color applied now
        const bgClass = "";

        return (
          <div
            key={conv._id}
            onClick={() => handleClick(conv._id)}
            className={`flex items-center gap-4 p-3 cursor-pointer border-b ${bgClass}`}
          >
            <img
              src={
                conv.profilePhoto
                  ? getBackendImageUrl(conv.profilePhoto)
                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAACUCAMAAAD26AbpAAAAM1BMVEXl5uivtLjZ3eHg5OiprrLm5uassbWttLrp6u20ub3j5+jl6ezd3+LBxcnl5+vJzdHO09aqgMmLAAADzElEQVR4nO2c2XLrIAyGzWIsbLb3f9oDTtqmp24MajDKjL6rdjqd6o8QoIVOE8MwDMMwDMMwDMMwDPOWrOt6/IP5Wjv+yhYAQCmXUSp/GT5+EJ79FhX2DxtU8lYIkxHC+qRgG21XA1mCi0ZrY5aCyOTvbFSjDWtAeqPFD4zxcrRldYDzwtw++x8ihJdAPqYhRGuOzN9ZjI0TjLbxObsLflewlNXkSGsA+cQFH6vJSsp7k3zigoeIIBzV8tz+2yYrSZ5va15FNT64+4FmPITzOPjUYEm6IfhqBVmDJxjSkOoFFBI9DRXb6TcsqXDYpnmeWpZRwXhK6UNZEtK2KShuICYhNjohuyGOtvs7rtkJ2Q1utNXfSObwdv3cDWm01Y+o1mDeJXhS51u7gKKBUiYqD/LMc7Sj4wZo3492L0Q6pxtgQiHj6UjYEFtqwdK5JwFOgRB0YmHCrSNh6HgBK0GzhFeCOhZILaQN6QWxkckZALupAiEJ6KONioQt4u5IkZAE5DVPBioS1oC7bIvRhn+xtpXBPjB+tOGPhISQoEklngGR/htK6X8OyfD+RZh3L4UVmt1gIp0L0p3WaKAUCXcai/Mm0cmbP2mqARgfiEXCzlaa/nV1SWNGG3vMpoSoraxSquM9slV2eig3z28azjxRFPwyNkaAkDWchUNWQOaOfYjzJ6mD9oSKwUfMk0q6BMSRK8ogjE5UI/mLsJV+yfFqWoxXZAP5G+C8/TmOYYT1ElbSYfAAuFhU7NOR9ylJ66MDgpeKI+aciE4ASqYs446PSSrqE20HZIudk7IM24bwfubfCfv+SXsTPWEujDaCeS/WJkZb+z+84gmwwbZBUK3kXyJyXIdymdAYTLl0jD40ZpW80Mhm4Z49aOHz9XtcKMloNbZT+HWD1TaOGuJ2z14q1LMs5VXDgIIATLuAyrrRiYSSUF9eYoXp5oHa2lcF9sKnGTn2Wqeb6yhl1qvO7RU3BXaGiWtp3F1CHwVFw0XlDdVLQdFwyUmHHcSrYBHminE9SH84jE8lCN2/dQIVT47+Ru93DUEh53bqsapz1dj3VpDDoW/Fr7293MxiZUcJ7c9dMBKMV90kzDXPB1+A6TgXgJrZQUjoOOXjLlGQNfSbDPCI5y7t5BSomxvgFRlOjYRFdDreAm6IEINW69yjII58K4LBxD7/5QA7E4zB9hmFRj+0QGD6DOG6KyW4HhIAM8iJltBlABTidQqE6PJejCWwhNdI8OZCulQygpMX0qd1EkY3ZJjp1li+6m+VzhW53jTDMAzDMAzDMAzDMKP4B3odMcxu/3qqAAAAAElFTkSuQmCC"
              }
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p
                  className={`${
                    isUnread && isReceiver ? "font-bold" : "font-normal"
                  }`}
                >
                  {conv.username}
                </p>
                {conv.lastMessageTime && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conv.lastMessageTime), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              <p
                className={`text-sm truncate w-52 ${
                  isUnread && isReceiver
                    ? "font-bold text-black"
                    : "text-gray-600 font-normal"
                }`}
              >
                {conv.lastMessage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
