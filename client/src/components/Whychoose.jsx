import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Brain, GraduationCap, LineChart } from "lucide-react";

// 🎯 Animated Counter Component
function AnimatedCounter({ value, color }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        count: value,
        transition: { duration: 2, ease: "easeOut" },
      });
    }
  }, [inView, controls, value]);

  return (
    <motion.span
      ref={ref}
      animate={controls}
      initial={{ count: 0 }}
      className="font-bold text-lg sm:text-xl"
      style={{ color }}
    >
      {({ count }) => `${Math.floor(count)}%`}
    </motion.span>
  );
}

export default function WhyChoose() {
  // Pie chart data
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
    <section className="py-24 bg-[#F5FBFF] px-6 sm:px-10 lg:px-20 text-center overflow-hidden">
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
                isAnimationActive={true}
                animationDuration={1200}
                labelLine={false}
                label={({ index }) => (
                  <tspan>
                    <AnimatedCounter
                      value={data[index].value}
                      color={data[index].color}
                    />
                  </tspan>
                )}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
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
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4"
            style={{ borderColor: feature.icon.props.className.match(/#(.*?)"/)[1] }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-800 mt-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
