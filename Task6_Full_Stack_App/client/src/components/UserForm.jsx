import { useState } from 'react'

// A form for adding a user.
// App gives it an onSave function; onSave sends the data to the API and
// returns a list of error messages ([] means it worked).

const emptyForm = { name: '', email: '', age: '' }

function UserForm({ onSave }) {
  const [form, setForm] = useState(emptyForm)
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

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Add user'}
        </button>
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