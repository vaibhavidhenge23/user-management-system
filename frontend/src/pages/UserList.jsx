import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const UserList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await getUsers({ page, limit: 8, search, role, status });
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [page, role, status]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Deactivate this user?')) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const roleColor = { admin: '#e74c3c', manager: '#f39c12', user: '#27ae60' };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Users</h2>
                    {user?.role === 'admin' && (
                        <button style={styles.btn} onClick={() => navigate('/users/new')}>+ Create User</button>
                    )}
                </div>

                <div style={styles.filters}>
                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <input
                            style={styles.input}
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" style={styles.btn}>Search</button>
                    </form>
                    <select style={styles.select} value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                    </select>
                    <select style={styles.select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {loading ? <p>Loading...</p> : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Created By</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={styles.tr}>
                                    <td style={styles.td}>{u.name}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.badge, background: roleColor[u.role] }}>{u.role}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.badge, background: u.status === 'active' ? '#27ae60' : '#999' }}>{u.status}</span>
                                    </td>
                                    <td style={styles.td}>{u.createdBy?.name || '—'}</td>
                                    <td style={styles.td}>
                                        <button style={styles.actionBtn} onClick={() => navigate(`/users/${u._id}`)}>View</button>
                                        {user?.role === 'admin' && (
                                            <>
                                                <button style={styles.actionBtn} onClick={() => navigate(`/users/${u._id}/edit`)}>Edit</button>
                                                <button style={{ ...styles.actionBtn, color: '#e74c3c' }} onClick={() => handleDelete(u._id)}>Deactivate</button>
                                            </>
                                        )}
                                        {user?.role === 'manager' && u.role !== 'admin' && (
                                            <button style={styles.actionBtn} onClick={() => navigate(`/users/${u._id}/edit`)}>Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={styles.pagination}>
                    <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span style={{ padding: '0 12px' }}>Page {pagination.page} of {pagination.pages}</span>
                    <button style={styles.pageBtn} disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', color: '#1a1a2e' },
    filters: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    searchForm: { display: 'flex', gap: '8px' },
    input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '220px' },
    select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    btn: { padding: '8px 16px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    thead: { background: '#f8f9fa' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 16px', fontSize: '14px', color: '#333' },
    badge: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' },
    actionBtn: { background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' },
    pageBtn: { padding: '6px 16px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: '#fff' },
};

export default UserList;