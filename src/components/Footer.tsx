const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-india-saffron to-saffron-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">च</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">चक्षु</h3>
                <p className="text-sm text-gray-400 dark:text-light-yellow">
                  Chakshu Portal
                </p>
              </div>
            </div>
            <p className="text-gray-400 dark:text-light-yellow text-sm">
              Protecting India from fraud calls and SMS through collective
              action and government intervention.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-light-yellow">
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Report Fraud
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Track Status
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-light-yellow">
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400 dark:text-light-yellow">
              <p>Helpline: 1930</p>
              <p>Email: support@chakshu.gov.in</p>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-light-yellow">
            © 2025 Government of India. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="text-sm text-gray-400 dark:text-light-yellow">
              Made with 🇮🇳 for India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
