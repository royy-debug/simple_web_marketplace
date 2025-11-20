import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 text-center">
      <p>&copy; {new Date().getFullYear()} Marketplace. All Rights Reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:underline">Tentang Kami</a>
        <a href="#" className="hover:underline">Kontak</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
