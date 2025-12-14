import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'; // Use HashLink for smooth scrolling
import ShemLogo from './ShemLogo'; // Ensure ShemLogo can handle dark background or re-use existing
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
    const socialLinks = [
        { icon: <FaFacebookF />, href: '#' },
        { icon: <FaTwitter />, href: '#' },
        { icon: <FaLinkedinIn />, href: '#' },
        { icon: <FaYoutube />, href: '#' },
        { icon: <FaInstagram />, href: '#' },
    ];

    const columnLinks = [
        {
            title: 'Product',
            links: [
                { name: 'How It Works', to: '/#how-it-works' },
                { name: 'Features', to: '/#hero' }, // or #features-graphs
                { name: 'Advantages', to: '/#advantages' },
                { name: 'Analytics', to: '/#features-graphs' },
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'Our Team', to: '/#team' },
                { name: 'About SHEM', to: '/#hero' },
                { name: 'Contact', to: 'mailto:contact@shem.com' } // Simple mailto for now
            ]
        },
        {
            title: 'Resources',
            links: [
                { name: 'FAQ', to: '/#faq' },
                { name: 'Support', to: '/support' },
                { name: 'Documentation', to: '/documentation' }
            ]
        }
    ];

    return (
        <footer className="bg-neutralBg-dark text-white pt-20 pb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            {/* Reusing ShemLogo but ensuring it looks good on dark bg. 
                     If ShemLogo uses dark text by default, we might need to invert it or use a wrapper.
                     Our ShemLogo component renders an Image. 
                     The image (header-logo.png) provided by user has rounded corners now.
                     It might have white background in the image itself.
                     If it looks bad, we might need a container.
                  */}
                            <div className="bg-white/10 p-2 rounded-xl inline-block backdrop-blur-sm">
                                {/* Pass a prop or style to ensure visibility if needed, but component just renders img */}
                                {/* Wait, standard ShemLogo takes no props now. */}
                                <img src="/src/assets/header-logo.png" alt="SHEM" className="h-10 w-auto rounded-lg" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Leading the way in sustainable energy solutions.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {columnLinks.map((column, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-bold mb-6">{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.to}
                                            className="text-gray-400 hover:text-primary transition-colors text-sm"
                                            smooth
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} shem-energy2025@gmail.com | all rights reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;
