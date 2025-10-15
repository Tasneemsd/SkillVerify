import { ShieldCheck, Brain, BookOpen } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

// ✅ Animated Counter Component
function AnimatedCounter({ value, duration = 2 }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const formattedValue = parseInt(value.replace(/\D/g, ""));
  const suffix = value.replace(/\d/g, "");

  useEffect(() => {
    if (inView) {
      controls.start({
        count: formattedValue,
        transition: { duration, ease: "easeOut" },
      });
    }
  }, [inView, controls, formattedValue, duration]);

  return (
    <motion.span ref={ref} animate={controls} initial={{ count: 0 }}>
      {({ count }) => (
        <span className="font-bold text-blue-50">
          {Math.floor(count).toLocaleString()}
          {suffix}
        </span>
      )}
    </motion.span>
  );
}

// 🌟 Why Choose VHireToday Section
export function WhyChoose() {
  const features = [
    {
      title: "Verified Talent",
      desc: "Profiles are verified to ensure recruiters find skilled and genuine candidates quickly.",
      icon: <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />,
    },
    {
      title: "AI-Powered Matching",
      desc: "Smart AI matches students with the right internships and jobs based on skills and preferences.",
      icon: <Brain className="w-12 h-12 text-blue-600 mb-4" />,
    },
    {
      title: "Upskilling Opportunities",
      desc: "Access industry-relevant courses to boost employability and career growth.",
      icon: <BookOpen className="w-12 h-12 text-blue-600 mb-4" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white px-6 sm:px-10 lg:px-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-gray-800">
        Why Choose <span className="text-blue-700">VHireToday?</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-left"
          >
            {feature.icon}
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 📊 Stats Section with Animated Counters
export function StatsSection() {
  const stats = [
    { value: "50K+", label: "Active Internships" },
    { value: "200K+", label: "Registered Students" },
    { value: "10K+", label: "Companies Hiring" },
    { value: "100%", label: "Verified Profiles" },
  ];

  return (
    <section className="py-24 bg-blue-600 text-white text-center px-6 sm:px-10 lg:px-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-16">VHireToday in Numbers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center justify-center bg-white/10 p-8 rounded-3xl hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold mb-3">
              <AnimatedCounter value={stat.value} />
            </h3>
            <p className="text-sm sm:text-base font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
