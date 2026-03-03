import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // 1. Ambil token dari header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // 2. Pisahkan "Bearer " dari token-nya
    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug: pastikan token diterima dengan benar


    // 3. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug: pastikan token berhasil didecode

    if (!decoded) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }

    // 4. Cari user berdasarkan ID di dalam token
    // select('-password') artinya ambil semua field KECUALI password
    req.user = await User.findById(decoded.id).select('-password');
    console.log('Authenticated user:', req.user); // Debug: pastikan user ditemukan

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // lanjut ke controller
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export default protect;