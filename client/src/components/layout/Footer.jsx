const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>
          © {new Date().getFullYear()} Donghua Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
