import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.heading}>Welcome, {user?.name}!</h1>
                <p style={styles.sub}>Role: <strong>{user?.role}</strong></p>
                <div style={styles.cards}>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                        <div style={styles.card} onClick={() => navigate('/users')}>
                            <div style={styles.icon}>👥</div>
                            <div style={styles.cardTitle}>Manage Users</div>
                            <div style={styles.cardSub}>View and manage all users</div>
                        </div>
                    )}
                    <div style={styles.card} onClick={() => navigate('/profile')}>
                        <div style={styles.icon}>👤</div>
                        <div style={styles.cardTitle}>My Profile</div>
                        <div style={styles.cardSub}>View and update your profile</div>
                    </div>
                    {user?.role === 'admin' && (
                        <div style={styles.card} onClick={() => navigate('/users/new')}>
                            <div style={styles.icon}>➕</div>
                            <div style={styles.cardTitle}>Create User</div>
                            <div style={styles.cardSub}>Add a new user to the system</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    heading: { fontSize: '28px', color: '#1a1a2e', marginBottom: '8px' },
    sub: { color: '#666', marginBottom: '32px' },
    cards: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    card: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '28px', width: '200px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
    icon: { fontSize: '32px', marginBottom: '12px' },
    cardTitle: { fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' },
    cardSub: { fontSize: '13px', color: '#888' },
};

export default Dashboard;