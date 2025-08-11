import { useState } from 'react';
import { format } from 'date-fns';
import { db, collection } from '../firebase/config';
import { addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import styles from './AbsensiForm.module.css';

const AbsensiForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    noAnggota: '',
    jenisSuara: 'Sopran'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const waktuKehadiran = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      
      await addDoc(collection(db, 'absensi'), {
        ...formData,
        waktuKehadiran
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data absensi telah disimpan',
        confirmButtonColor: '#3498db'
      });
      
      setFormData({
        nama: '',
        noAnggota: '',
        jenisSuara: 'Sopran'
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menyimpan data',
        confirmButtonColor: '#e74c3c'
      });
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Form Absensi</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nama:</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>No. Anggota:</label>
          <input
            type="text"
            name="noAnggota"
            value={formData.noAnggota}
            onChange={(e) => setFormData({...formData, noAnggota: e.target.value})}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Jenis Suara:</label>
          <select
            name="jenisSuara"
            value={formData.jenisSuara}
            onChange={(e) => setFormData({...formData, jenisSuara: e.target.value})}
            className={styles.select}
          >
            <option value="Sopran">Sopran</option>
            <option value="Alto">Alto</option>
            <option value="Tenor">Tenor</option>
            <option value="Bass">Bass</option>
          </select>
        </div>
        
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AbsensiForm;