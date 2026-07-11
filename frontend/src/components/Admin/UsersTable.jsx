import { useState } from "react";
import { toast } from "react-toastify";

import {
  toggleUserBlockStatus,
} from "../../api/adminApi";

import "./UsersTable.css";

const UsersTable = ({
  users,
  refreshUsers,
}) => {
  const [loadingId, setLoadingId] =
    useState(null);

  const handleToggleBlock = async (
    userId,
    isBlocked
  ) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this user?`
    );

    if (!confirmAction) return;

    setLoadingId(userId);

    const response =
      await toggleUserBlockStatus(userId);

    if (response.success) {
      toast.success(response.message);
      refreshUsers();
    } else {
      toast.error(response.message);
    }

    setLoadingId(null);
  };

  return (
    <div className="users-table-card">
      <div className="table-header">
        <h2>👥 Users Management</h2>

        <span>{users.length} Users</span>
      </div>

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`role-badge ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>{user.phone}</td>

                  <td>
                    <span
                      className={
                        user.isBlocked
                          ? "status blocked"
                          : "status active"
                      }
                    >
                      {user.isBlocked
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </td>

                  <td>
                    {user.role ===
                    "admin" ? (
                      <span className="admin-text">
                        Protected
                      </span>
                    ) : (
                      <button
                        className={
                          user.isBlocked
                            ? "unblock-btn"
                            : "block-btn"
                        }
                        disabled={
                          loadingId ===
                          user._id
                        }
                        onClick={() =>
                          handleToggleBlock(
                            user._id,
                            user.isBlocked
                          )
                        }
                      >
                        {loadingId ===
                        user._id
                          ? "Updating..."
                          : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;