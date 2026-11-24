import { useState } from 'react'

// One form for both ADDING and EDITING a user.
// - onSave sends the data to the API and returns a list of errors ([] means it worked).
// - editingUser is the user being edited, or null when adding a new one.
// - onCancel is called when the Cancel button is clicked (edit mode only).

const emptyForm = { name: '', email: '', age: '' }

function UserForm({ onSave, editingUser, onCancel }) {
  // Start with the user's details when editing, or empty boxes when adding.
  // (App gives this form a new "key" whenever editingUser changes, so React
  //  starts it fresh with the right values.)
  const [form, setForm] = useState(
    editingUser
      ? { name: editingUser.name, email: editingUser.email, age: String(editingUser.age) }
      : emptyForm
  )
  const [errors, setErrors] = useState([])
  const [saving, setSaving] = useState(false)

  // Update one field as the user types
  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    const userData = {
      name: form.name,
      email: form.email,
      age: form.age === '' ? undefined : Number(form.age),   // the API expects a number
    }

    const problems = await onSave(userData)
    setSaving(false)

    if (problems.length > 0) {
      setErrors(problems)           // show what went wrong
    } else {
      setErrors([])
      setForm(emptyForm)            // clear the form after a successful save
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input
            name="name"
            type="text"
            placeholder="e.g. Ada Okafor"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="e.g. ada@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            min="1"
            max="120"
            placeholder="e.g. 25"
            value={form.age}
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingUser ? 'Save changes' : 'Add user'}
          </button>
          {editingUser && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </form>
  )
}

export default UserForm
