import React, { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, useInView } from "framer-motion";
import { Users, Brain, GraduationCap, LineChart } from "lucide-react";

// ✅ Animated Counter (for pie chart labels)
function AnimatedCounter({ value, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
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
    <tspan ref={ref} fill={color} fontWeight="bold">
      {count}%
    </tspan>
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
    <section
      id="why-choose"
      className="py-24 bg-gradient-to-b from-[#F8FBFF] to-[#EAF6FF] px-6 sm:px-10 lg:px-20 overflow-hidden"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-800">
        Why <span className="text-[#1E88E5]">Choose VHireToday?</span>
      </h2>

      {/* Chart + Info */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        {/* Animated Pie Chart */}
        <motion.div
          className="w-full lg:w-1/2 bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 1.2 * outerRadius;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const entry = data[index];
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={entry.color}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontWeight="bold"
                      fontSize={14}
                    >
                      {entry.value}%
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart Description */}
        <motion.div
          className="lg:w-1/2 text-gray-700 leading-relaxed text-center lg:text-left"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg sm:text-xl mb-4">
            Our data highlights the communication gap between job seekers and employers. Many
            candidates never receive responses post-application.
          </p>
          <p className="text-lg sm:text-xl">
            <b>VHireToday</b> bridges this gap using verified profiles and AI-powered matching,
            ensuring transparent and fair recruitment for every student.
          </p>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {features.map((feature, i) => {
          const color = feature.icon.props.className.match(/#([0-9A-Fa-f]{6})/)[0];
          return (
            <motion.div
              key={i}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 border-t-4 p-8 flex flex-col items-center text-center"
              style={{ borderColor: color }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-3 text-sm">{feature.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
