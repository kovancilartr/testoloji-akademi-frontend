const StatsSection = () => {
    return (
        <section className="py-12 border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Dosya Hazır", value: "10K+" },
                        { label: "Aktif Kullanıcı", value: "2500+" },
                        { label: "Soru Havuzu", value: "50K+" },
                        { label: "Hız Artışı", value: "%90" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center space-y-1">
                            <div className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StatsSection