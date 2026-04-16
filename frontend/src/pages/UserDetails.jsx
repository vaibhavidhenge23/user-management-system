import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id).then(({ data }) => setUser(data.user));
    }, [id]);

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
                            <span style={{ ...styles.badge, background: user.status === 'active' ? '#27ae60' : '#999', marginLeft: '8px' }}>{user.status}</span>
                        </div>
                    </div>
                    <div style={styles.info}>
                        <Row label="Email" value={user.email} />
                        <Row label="Role" value={user.role} />
                        <Row label="Status" value={user.status} />
                        <Row label="Created At" value={new Date(user.createdAt).toLocaleString()} />
                        <Row label="Updated At" value={new Date(user.updatedAt).toLocaleString()} />
                        <Row label="Created By" value={user.createdBy?.name || '—'} />
                        <Row label="Last Updated By" value={user.updatedBy?.name || '—'} />
                    </div>
                    <div style={styles.actions}>
                        <button style={styles.backBtn} onClick={() => navigate('/users')}>← Back</button>
                        {currentUser?.role === 'admin' && (
                            <button style={styles.editBtn} onClick={() => navigate(`/users/${id}/edit`)}>Edit User</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ width: '160px', color: '#888', fontSize: '14px' }}>{label}</span>
        <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{value}</span>
    </div>
);

const styles = {
    container: { padding: '40px', display: 'flex', justifyContent: 'center' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '600px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' },
    avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#6c63ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700' },
    name: { fontSize: '22px', color: '#1a1a2e', marginBottom: '8px' },
    badge: { color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '12px' },
    info: { marginBottom: '32px' },
    actions: { display: 'flex', gap: '12px' },
    backBtn: { padding: '10px 20px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    editBtn: { padding: '10px 20px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default UserDetail;