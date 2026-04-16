import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>UserMS</div>
            <div style={styles.links}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Link to="/users" style={styles.link}>Users</Link>
                )}
                <Link to="/profile" style={styles.link}>My Profile</Link>
            </div>
            <div style={styles.right}>
                <span style={styles.badge}>{user?.role}</span>
                <span style={styles.name}>{user?.name}</span>
                <button onClick={handleLogout} style={styles.logout}>Logout</button>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '60px', background: '#1a1a2e', color: '#fff' },
    brand: { fontSize: '20px', fontWeight: '700', color: '#6c63ff' },
    links: { display: 'flex', gap: '24px' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
    right: { display: 'flex', alignItems: 'center', gap: '12px' },
    badge: { background: '#6c63ff', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize' },
    name: { fontSize: '14px', color: '#ccc' },
    logout: { background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default Navbar;