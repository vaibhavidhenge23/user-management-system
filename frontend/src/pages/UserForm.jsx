import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const UserForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isEdit) {
            getUserById(id).then(({ data }) => {
                const u = data.user;
                setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { ...form };
            if (isEdit && !payload.password) delete payload.password;
            if (isEdit) {
                await updateUser(id, payload);
                setSuccess('User updated successfully!');
            } else {
                await createUser(payload);
                setSuccess('User created successfully!');
            }
            setTimeout(() => navigate('/users'), 1000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>{isEdit ? 'Edit User' : 'Create User'}</h2>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label style={styles.label}>Name</label>
                            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input style={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>{isEdit ? 'New Password (leave blank to keep)' : 'Password'}</label>
                            <input style={styles.input} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!isEdit && { required: true })} />
                        </div>
                        {currentUser?.role === 'admin' && (
                            <div style={styles.field}>
                                <label style={styles.label}>Role</label>
                                <select style={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}
                        <div style={styles.field}>
                            <label style={styles.label}>Status</label>
                            <select style={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div style={styles.buttons}>
                            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/users')}>Cancel</button>
                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', display: 'flex', justifyContent: 'center' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '500px' },
    title: { fontSize: '22px', color: '#1a1a2e', marginBottom: '24px' },
    error: { background: '#ffe0e0', color: '#c0392b', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
    success: { background: '#e0ffe0', color: '#27ae60', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
    buttons: { display: 'flex', gap: '12px', marginTop: '24px' },
    cancelBtn: { flex: 1, padding: '10px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    submitBtn: { flex: 1, padding: '10px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default UserForm;