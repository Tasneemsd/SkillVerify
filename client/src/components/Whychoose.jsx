import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Brain, GraduationCap, LineChart } from "lucide-react";

// ✅ Animated Counter Component
function AnimatedCounter({ value, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = value / (duration / 16); // ~60fps
      const step = () => {
        start += increment;
        if (start < value) {
          setCount(Math.floor(start));
          requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(step);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="font-bold text-lg sm:text-xl" style={{ color }}>
      {count}%
    </span>
  );
}

export default function WhyChoose() {
  const data = [
    { name: "Never heard back after applying", value: 34, color: "#1E88E5" },
    { name: "Ghosted before interview", value: 30, color: "#29B6F6" },
    { name: "Ghosted after first interview", value: 21, color: "#4DD0E1" },
    { name: "Ghosted after several rounds", value: 8, color: "#EC407A" },
    { name: "Ghosted after offer", value: 6, color: "#FB8C00" },
  ];

  const features = [
    {
      icon: <Users className="w-12 h-12 text-[#1E88E5]" />,
      title: "Verified Talent Network",
      desc: "Every student profile is verified to ensure recruiters connect only with authentic, skilled candidates.",
    },
    {
      icon: <Brain className="w-12 h-12 text-[#29B6F6]" />,
      title: "AI Matching Engine",
      desc: "Smart AI matches students with the right internships and jobs based on their skills and interests.",
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-[#4DD0E1]" />,
      title: "Upskilling Opportunities",
      desc: "Learn new industry-relevant skills to grow faster and get better career opportunities.",
    },
    {
      icon: <LineChart className="w-12 h-12 text-[#FB8C00]" />,
      title: "Career Growth Analytics",
      desc: "Real-time analytics to track performance and optimize hiring and learning outcomes.",
    },
  ];

  return (
    <section className="py-24 bg-[#F5FBFF] px-6 sm:px-10 lg:px-20 text-center overflow-hidden" id="why-choose">
      <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-gray-800">
        VHireToday <span className="text-[#1E88E5]">Impact & Insights</span>
      </h2>

      {/* Chart + Info Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-20">
        {/* Animated Pie Chart */}
        <motion.div
          className="w-full lg:w-1/2 h-80 bg-white rounded-3xl shadow-lg p-6 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                labelLine={true}
                label={({ index, x, y }) => {
                  if (!data[index]) return null;
                  return (
                    <text x={x} y={y} textAnchor={x > 150 ? "start" : "end"} dominantBaseline="middle" fill={data[index].color} fontSize={14} fontWeight="bold">
                      <AnimatedCounter value={data[index].value} color={data[index].color} />
                    </text>
                  );
                }}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart Description */}
        <motion.div
          className="lg:w-1/2 text-gray-700 text-left leading-relaxed"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg sm:text-xl mb-4">
            Our data highlights the common gaps between job seekers and employers. 
            Many students never hear back after applying or interviewing.
          </p>
          <p className="text-lg sm:text-xl">
            <b>VHireToday</b> bridges this gap using verified profiles and 
            AI-powered systems to ensure transparent and fair hiring for everyone.
          </p>
        </motion.div>
      </div>

      {/* Why Choose Us Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {features.map((feature, i) => {
          const colorMatch = feature.icon.props.className.match(/#([0-9A-Fa-f]{6})/);
          return (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4"
              style={{ borderColor: colorMatch ? `#${colorMatch[1]}` : "#000" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mt-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
