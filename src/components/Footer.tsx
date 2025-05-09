// @ts-nocheck

import React from "react";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0B0F]/90 text-gray-300 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">AnonymousDock</h3>
            <p className="text-sm">
              Democratizing hardware resources through decentralized
              infrastructure.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.x.com" className="hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://www.github.com" className="hover:text-white">
                <Github size={20} />
              </a>

              <a href="https://www.linkedin.com" className="hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Network Status
                </a>
              </li>
              <li>
                <a href="/buy-gpu" className="hover:text-white">
                  Provider Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Hardware Specifications
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@anonymousDock.com</span>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Discord Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  GitHub Discussions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {currentYear} AnonymousDock. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-white">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
