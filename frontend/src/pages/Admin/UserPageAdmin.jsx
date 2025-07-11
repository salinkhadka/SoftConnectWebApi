import React, { useState } from "react";
import UserTableComponent from "../../components/Admin/UserTableComponent";
import { useGetUsersAdmin, useUpdateUser, useDeleteUser } from "../../hooks/Admin/adminUserhook";

export default function UserPageAdmin() {
  const [search, setSearch] = useState("");

  // Use the renamed hook here
  const { data: users = [], isLoading, error } = useGetUsersAdmin({ search });

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleUpdate = (id, formData) => {
    updateUserMutation.mutate({ id, formData });
  };

  const handleDelete = (user) => {
    deleteUserMutation.mutate(user._id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>User Management</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, width: 300, marginBottom: 20 }}
      />

      {isLoading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <UserTableComponent users={users} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
