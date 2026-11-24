// Shows all users in a table, with a Delete button on each row.
// It doesn't fetch anything itself: App gives it the users and a function to call.

// Turn "2026-11-24T09:00:00.000Z" into "24 Nov 2026"
function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function UserTable({ users, onDelete }) {
  if (users.length === 0) {
    return <p className="empty">No users yet. Add the first one!</p>
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Added</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="muted">{user.id}</td>
              <td>
                <div className="name-cell">
                  <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                  {user.name}
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td className="muted">{formatDate(user.created_at)}</td>
              <td className="actions-col">
                <button className="btn btn-delete" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable