import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../services/api';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMyProfile().then(({ data }) => {
            setUser(data.user);
            setForm({ name: data.user.name, password: '' });
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = { name: form.name };
            if (form.password) payload.password = form.password;
            await updateMyProfile(payload);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div><Navbar /><p style={{ padding: '40px' }}>Loading...</p></div>;

    const roleColor = { admin: '#e74c3c', manager: '#f39c12', user: '#27ae60' };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <div style={styles.avatar}>{user.name[0].toUpperCase()}</div>
                        <div>
                            <h2 style={styles.name}>{user.name}</h2>
                            <span style={{ ...styles.badge, background: roleColor[user.role] }}>{user.role}</span>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <Row label="Email" value={user.email} />
                        <Row label="Status" value={user.status} />
                        <Row label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
                        <Row label="Last Updated" value={new Date(user.updatedAt).toLocaleString()} />
                        {user.createdBy && <Row label="Created By" value={user.createdBy.name} />}
                        {user.updatedBy && <Row label="Last Updated By" value={user.updatedBy.name} />}
                    </div>

                    <h3 style={styles.sectionTitle}>Update Profile</h3>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label style={styles.label}>Name</label>
                            <input
                                style={styles.input}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>New Password (leave blank to keep)</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <button style={styles.btn} type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ width: '160px', color: '#888', fontSize: '14px' }}>{label}</span>
        <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{value}</span>
    </div>
);

const styles = {
    container: { padding: '40px', display: 'flex', justifyContent: 'center' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '560px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
    avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#6c63ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700' },
    name: { fontSize: '22px', color: '#1a1a2e', marginBottom: '8px' },
    badge: { color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '12px' },
    infoBox: { marginBottom: '28px' },
    sectionTitle: { fontSize: '16px', color: '#1a1a2e', marginBottom: '16px' },
    error: { background: '#ffe0e0', color: '#c0392b', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
    success: { background: '#e0ffe0', color: '#27ae60', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};

export default Profile;