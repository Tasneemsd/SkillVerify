import { ShieldCheck, Brain, BookOpen } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

// ✅ Animated Counter Component
function AnimatedCounter({ value, duration = 2 }) {
  const controls = useAnimation();
  const formattedValue = parseInt(value.replace(/\D/g, "")); // Extract number
  const suffix = value.replace(/\d/g, ""); // Keep suffix like "K+" or "%"
  const displayValue = { count: 0 };

  useEffect(() => {
    controls.start({
      count: formattedValue,
      transition: { duration, ease: "easeOut" },
    });
  }, [controls, formattedValue, duration]);

  return (
    <motion.span
      animate={controls}
      initial={{ count: 0 }}
      variants={{}}
    >
      {({ count }) => (
        <span>
          {Math.floor(count).toLocaleString()}
          {suffix}
        </span>
      )}
    </motion.span>
  );
}

// 🌟 Why Choose VHireToday Section
export function WhyChoose() {
  return (
    <section
      id="why-choose"
      className="py-20 bg-gradient-to-b from-blue-50 to-white px-6 sm:px-10 lg:px-20 text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">
        Why Choose <span className="text-blue-700">VHireToday?</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Verified Talent",
            desc: "Every profile is carefully verified, helping recruiters find authentic and skilled candidates faster.",
            icon: <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />,
          },
          {
            title: "AI-Powered Matching",
            desc: "Get automatically matched with the right internships and jobs based on your skills and goals.",
            icon: <Brain className="w-12 h-12 text-blue-600 mb-4" />,
          },
          {
            title: "Upskilling Opportunities",
            desc: "Learn from industry-focused paid and free courses to enhance your employability.",
            icon: <BookOpen className="w-12 h-12 text-blue-600 mb-4" />,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center"
          >
            {item.icon}
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {item.desc}
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
    <section className="py-20 bg-blue-600 text-white text-center px-6 sm:px-10 lg:px-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12">
        VHireToday in Numbers
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center justify-center bg-white/10 p-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold mb-2">
              <AnimatedCounter value={stat.value} />
            </h3>
            <p className="text-sm sm:text-base font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
