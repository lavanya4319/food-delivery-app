import "./UsersTable.css";

const UsersTable = ({ users }) => {
  return (
    <div className="users-table-container">
      <h2>👥 All Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No Users Found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`role ${user.role}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>{user.phone}</td>

                <td>{user.address}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;