import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [footerData, setFooterData] = useState({
    email: 'info@becreativity.com',
    phone: '+1 (555) 123-4567',
    hours: 'Mon - Fri, 9AM - 6PM',
    company: 'BE Creativity SD',
    address: '123 Creative Street',
    city: 'San Diego, CA 92101',
    country: 'United States',
    disclaimer: 'BE Creativity SD is an e-commerce platform offering natural and custom products. All products are provided "as is" without any warranty. We are not responsible for any direct, indirect, incidental, or consequential damages arising from the use of our products or services. Prices and availability are subject to change without notice. By using this website, you agree to our terms and conditions. Please read our full privacy policy and terms of service for more information.'
  });

  useEffect(() => {
    const savedFooter = localStorage.getItem('footerData');
    if (savedFooter) {
      setFooterData(JSON.parse(savedFooter));
    }
  }, []);

  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold">Email:</span> {footerData.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {footerData.phone}
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {footerData.hours}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <div className="space-y-2 text-gray-300">
              <p>{footerData.company}</p>
              <p>{footerData.address}</p>
              <p>{footerData.city}</p>
              <p>{footerData.country}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <a href="/" className="hover:text-white transition">Home</a>
              </p>
              <p>
                <a href="/be-natural" className="hover:text-white transition">BE Natural</a>
              </p>
              <p>
                <a href="/be-custom" className="hover:text-white transition">BE Custom</a>
              </p>
              <p>
                <a href="/cart" className="hover:text-white transition">Shopping Cart</a>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-700 pt-8">
          <h3 className="text-lg font-bold mb-3">Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {footerData.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 BE Creativity SD. All rights reserved.</p>
          <p className="mt-2 text-sm">Designed with ❤️ for creativity and innovation</p>
        </div>
      </div>
    </footer>
  );
}
