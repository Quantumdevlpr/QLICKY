
import { QrCode, Github, Twitter, Mail, User, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 lg:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12 items-stretch">
          {/* Left: Branding and Links */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <QrCode className="h-6 w-6 text-primary-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Qliky</span>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Qliky is a fast and secure QR Code Generator that helps you create and manage QR codes effortlessly. Trusted by hundreds of users.
              </p>
              
                {/* GIF -pseudoclan*/}
                <div className="mb-6 w-full flex justify-start">
                  <img
                    src="https://res.cloudinary.com/dq3rul8yt/image/upload/v1754234562/QLICKY_jdd5km.gif"
                    alt=" Animated Banner of Our brand"
                    className="w-48 h-auto rounded-lg shadow-md"
                  />
                </div>
                <br>
                </br>
                <div className="flex items-center space-x-5 mb-6">
                <a href="https://github.com/Shivansh-Pseudoclan" className="text-gray-500 hover:text-primary-500 transition-colors" aria-label="GitHub">
                  <Github className="h-6 w-6" />
                </a>
                <a href="https://x.com/pseudo_clan" className="text-gray-500 hover:text-primary-500 transition-colors" aria-label="Twitter">
                  <Twitter className="h-6 w-6" />
                </a>
                <br></br>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                <a href="https://pseudoclan.com/" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
                <a href="https://pseudoclan.com/" className="hover:text-primary-500 transition-colors">Terms of Service</a>
                <a href="https://x.com/pseudo_clan" className="hover:text-primary-500 transition-colors">Contact</a>
              </div>
            </div>
          </div>

          {/* Right: Inline Contact Form */}
          <div className="w-full max-w-xl lg:w-[600px] ml-auto border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg bg-white dark:bg-gray-900 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Contact Us</h3>
            <form className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="footer-name">Name</label>
                <span className="absolute left-3 top-9 text-gray-400"><User size={18} /></span>
                <input
                  id="footer-name"
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 dark:bg-gray-800 dark:text-white transition"
                  placeholder="Your name"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="footer-email">Email</label>
                <span className="absolute left-3 top-9 text-gray-400"><Mail size={18} /></span>
                <input
                  id="footer-email"
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 dark:bg-gray-800 dark:text-white transition"
                  placeholder="you@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="footer-message">Message</label>
                <span className="absolute left-3 top-9 text-gray-400"><MessageSquare size={18} /></span>
                <textarea
                  id="footer-message"
                  rows={4}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 dark:bg-gray-800 dark:text-white transition resize-none"
                  placeholder="Write your message here"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2"
              >
                <Mail size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} <span className="font-semibold text-primary-500">Qliky</span>. All rights reserved.

        </div>
      </div>
    </footer>
  );
};

export default Footer;