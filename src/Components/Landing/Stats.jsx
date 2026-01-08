import React, { useEffect, useState, useRef } from 'react';

const stats = [
    { id: 1, label: "Active Agents", value: 10000, suffix: "+" },
    { id: 2, label: "API Requests", value: 50, suffix: "M+" },
    { id: 3, label: "Uptime Guarantee", value: 99.9, suffix: "%" },
    { id: 4, label: "Happy Users", value: 5000, suffix: "+" },
];

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={containerRef} className="py-12">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/30 backdrop-blur-md rounded-[32px] border border-white/50 p-10 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
                    {stats.map((stat, index) => (
                        <div key={stat.id} className="text-center relative">
                            {/* Separator line for all except last */}
                            {index !== stats.length - 1 && (
                                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200/50"></div>
                            )}

                            <div className={`text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                                {stat.value}{stat.suffix}
                            </div>
                            <div className={`text-sm font-bold text-gray-500 uppercase tracking-widest transition-all duration-1000 ease-out delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
