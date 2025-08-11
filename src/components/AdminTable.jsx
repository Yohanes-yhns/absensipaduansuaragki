import { useState, useEffect } from 'react';
import { db, collection } from '../firebase/config';
import { onSnapshot } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import styles from './AdminTable.module.css';

const AdminTable = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [absensiData, setAbsensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'waktuKehadiran',
    direction: 'descending'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (username === 'BettyTjoa' && password === 'BettyGKI') {
      await Swal.fire({
        title: 'Login Berhasil!',
        text: 'Anda akan diarahkan ke halaman admin',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 1500,
        timerProgressBar: true
      });
      setIsLoggedIn(true);
    } else {
      await Swal.fire({
        title: 'Login Gagal',
        text: 'Username atau password salah',
        icon: 'error',
        confirmButtonText: 'Coba Lagi'
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubscribe = onSnapshot(collection(db, 'absensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAbsensiData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  const exportToExcel = () => {
    const excelData = sortedData.map(item => ({
      'Nama': item.nama,
      'No. Anggota': item.noAnggota,
      'Jenis Suara': item.jenisSuara,
      'Waktu Kehadiran': item.waktuKehadiran
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Absensi");
    XLSX.writeFile(wb, `data_absensi_${searchDate || 'all'}.xlsx`);
    
    Swal.fire({
      title: 'Export Berhasil!',
      text: `Data absensi telah diexport ke Excel`,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true
    });
  };

  // Filter data berdasarkan tanggal
  const filteredData = absensiData.filter(item => {
    if (!searchDate) return true;
    const itemDate = new Date(item.waktuKehadiran).toISOString().split('T')[0];
    return itemDate === searchDate;
  });

  // Sorting data
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a[sortConfig.key]);
    const dateB = new Date(b[sortConfig.key]);
    if (dateA < dateB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (dateA > dateB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Login Admin</h2>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className={styles.title}>Data Absensi</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button 
            onClick={exportToExcel}
            className={styles.exportButton}
            disabled={loading || sortedData.length === 0}
          >
            Download Excel
          </button>
          <button 
            onClick={() => {
              Swal.fire({
                title: 'Yakin ingin logout?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, logout',
                cancelButtonText: 'Batal'
              }).then((result) => {
                if (result.isConfirmed) {
                  setIsLoggedIn(false);
                  setUsername('');
                  setPassword('');
                }
              });
            }}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Memuat data...</div>
      ) : sortedData.length === 0 ? (
        <div className={styles.loading}>
          {searchDate ? `Tidak ada data pada tanggal ${searchDate}` : 'Tidak ada data absensi'}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Menampilkan {sortedData.length} data {searchDate && `pada tanggal ${searchDate}`}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nama</th>
                <th className={styles.th}>No. Anggota</th>
                <th className={styles.th}>Jenis Suara</th>
                <th 
                  className={`${styles.th} ${styles.sortableHeader}`} 
                  onClick={() => requestSort('waktuKehadiran')}
                >
                  Waktu Kehadiran {sortConfig.key === 'waktuKehadiran' ? 
                    (sortConfig.direction === 'ascending' ? '⬆️' : '⬇️') : '↕️'}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.id} className={styles.tr}>
                  <td className={styles.td}>{item.nama}</td>
                  <td className={styles.td}>{item.noAnggota}</td>
                  <td className={styles.td}>{item.jenisSuara}</td>
                  <td className={styles.td}>
                    {new Date(item.waktuKehadiran).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminTable;