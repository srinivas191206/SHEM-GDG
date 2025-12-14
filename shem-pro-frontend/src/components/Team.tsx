import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const teamMembers = [
    {
        name: 'Bonthalakoti Ritesh',
        role: 'Team Lead (Coordinator)',
        id: '23221-EC-060',
        bio: 'Leading the project with a vision for smart energy.',
        image: '/ritesh.png'
    },
    {
        name: 'Angati Durga Prasad',
        role: 'Documentation Lead',
        id: '23221-EC-058',
        bio: 'Ensuring comprehensive and clear project documentation.',
        image: '/DP pic.jpeg'
    },
    {
        name: 'Cherukuri Ramalakshmi',
        role: 'Hardware Lead',
        id: '23221-EC-065',
        bio: 'Expert in circuit design and sensor integration.',
        image: '/ramalakshimi pic.jpeg'
    },
    {
        name: 'Buradapati Nikitha',
        role: 'Software Lead',
        id: '23221-EC-061',
        bio: 'Developing the frontend and backend logic for SHEM.',
        image: '/nikitha pic.jpeg'
    },
];

const Team: React.FC = () => {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);

    return (
        <section id="team" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                    <p className="text-xl text-gray-600">The minds behind Smart Home Energy Manager.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="relative group perspective-1000"
                            onMouseEnter={() => setHoveredMember(index)}
                            onMouseLeave={() => setHoveredMember(null)}
                        >
                            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center h-full relative z-10">
                                <div className="bg-gray-200 rounded-full p-1 mb-4 overflow-hidden h-24 w-24 border-4 border-white shadow-sm">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                <p className="text-primary font-medium text-sm mt-1">{member.role}</p>
                                <p className="text-gray-400 text-xs mt-1">{member.id}</p>
                            </div>

                            {/* Hover Popup Card */}
                            <AnimatePresence>
                                {hoveredMember === index && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-64 bg-gray-900 text-white rounded-xl shadow-2xl p-5 z-50 pointer-events-none"
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full border-2 border-primary" />
                                            <div className="text-left">
                                                <p className="font-bold text-base text-white leading-tight">{member.name}</p>
                                                <p className="text-xs text-primary-400 font-medium">{member.role}</p>
                                            </div>
                                        </div>
                                        <hr className="border-gray-700 my-2" />
                                        <p className="text-xs text-gray-300 text-left leading-relaxed">
                                            {member.bio}
                                        </p>
                                        {/* Arrow */}
                                        <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
