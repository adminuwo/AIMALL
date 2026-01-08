import React, { useRef, useEffect } from 'react';
import { Star, MoreHorizontal } from 'lucide-react';

const vendors = [
    { id: 1, name: 'Costation', category: 'Finance', rating: 4.2 },
    { id: 2, name: 'Chatleet AI V2.0', category: 'Assistant', rating: 4.9 },
    { id: 3, name: 'Analytics Pro', category: 'Data', rating: 4.7 },
    { id: 4, name: 'Analytisa Pro', category: 'Data', rating: 4.8 },
    { id: 5, name: 'Nomren Being', category: 'Health', rating: 4.5 },
    { id: 6, name: 'Meshiel Kit', category: 'Dev', rating: 4.9 },
];

const FeaturedVendors = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-12');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = containerRef.current.querySelectorAll('.vendor-card');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={containerRef} className="py-8 pb-16">
            <div className="container">
                <h2 className="text-2xl font-semibold mb-6 text-[#1A1A1A]">Featured Vendors</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                    {vendors.map((vendor, index) => (
                        <div
                            key={vendor.id}
                            style={{ transitionDelay: `${index * 100}ms` }}
                            className="vendor-card opacity-0 translate-y-12 group bg-white/60 backdrop-blur-xl rounded-[20px] p-5 border border-white/60 flex flex-col gap-4 transition-all duration-700 ease-out hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] cursor-default"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center font-bold text-[0.95rem] shadow-lg">A</div>
                                <div className="flex-1">
                                    <h3 className="text-[0.95rem] font-bold text-[#1A1A1A] group-hover:text-[#3B82F6] transition-colors">{vendor.name}</h3>
                                    <span className="block text-[0.75rem] font-medium text-gray-400 tracking-wide uppercase">{vendor.category}</span>
                                </div>
                                <button className="bg-transparent p-1 -mr-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreHorizontal size={18} color="#999" />
                                </button>
                            </div>

                            <div className="my-2 space-y-2 opacity-60">
                                {/* Visual placeholder lines for 'ghost' text */}
                                <div className="h-1.5 bg-gray-300 rounded-full w-full"></div>
                                <div className="h-1.5 bg-gray-300 rounded-full w-[70%]"></div>
                            </div>

                            <div className="flex justify-between items-center mt-auto pt-2">
                                <button className="bg-[#3B82F6] hover:bg-[#2563EB] active:scale-95 transition-all text-white text-[0.7rem] px-5 py-2 rounded-full font-semibold cursor-pointer shadow-[0_4px_10px_rgba(59,130,246,0.3)]">Install now</button>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#1A1A1A]">{vendor.rating}</span>
                                    <div className="flex -space-x-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} fill={i < Math.floor(vendor.rating) ? "#1A1A1A" : "#E5E7EB"} stroke="none" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedVendors;
