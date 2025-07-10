import React from "react";
import UserTableComponent from "../../components/Admin/UserTableComponent";
import { useGetUsers, useDeleteUser, useUpdateUser } from "../../hooks/Admin/adminUserhook";

export default function UserPageAdmin() {
  const { data, isLoading, isError } = useGetUsers();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();

  const handleDelete = (user) => {
    deleteUser.mutate(user._id);
  };
  

const handleUpdate = (id, formData) => {
  updateUser.mutate({ id, formData });
};




  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  return (
    <div>
      <h2>User Management</h2>
      <UserTableComponent
        users={data?.data || []}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
