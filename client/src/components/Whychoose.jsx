import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  Building2,
  FileText,
  Target,
  CheckCircle,
  Zap,
  LineChart,
  Code,
  Megaphone,
  PenTool,
  DollarSign,
  PieChart as PieChartIcon,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const useCounter = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};
// Categories Section
const CategoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = [
    {
      icon: Code,
      name: 'IT & Software',
      jobs: 3500,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20',
      iconColor: 'text-blue-600',
      description: 'Build the future with code'
    },
    {
      icon: Megaphone,
      name: 'Marketing',
      jobs: 1800,
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-pink-400/20 to-rose-400/20',
      iconColor: 'text-pink-600',
      description: 'Tell compelling brand stories'
    },
    {
      icon: PenTool,
      name: 'Design',
      jobs: 1200,
      gradient: 'from-violet-500 to-purple-500',
      iconBg: 'bg-gradient-to-br from-violet-400/20 to-purple-400/20',
      iconColor: 'text-violet-600',
      description: 'Create stunning experiences'
    },
    {
      icon: DollarSign,
      name: 'Finance',
      jobs: 950,
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-400/20 to-teal-400/20',
      iconColor: 'text-emerald-600',
      description: 'Drive business growth'
    },
    {
      icon: PieChartIcon,
      name: 'Analytics',
      jobs: 1400,
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-gradient-to-br from-orange-400/20 to-amber-400/20',
      iconColor: 'text-orange-600',
      description: 'Transform data into insights'
    },
    {
      icon: UserCheck,
      name: 'HR',
      jobs: 680,
      gradient: 'from-teal-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-teal-400/20 to-cyan-400/20',
      iconColor: 'text-teal-600',
      description: 'Shape company culture'
    }
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Popular Categories
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Endless{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your dream career across diverse industries and growing fields
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -12,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="group relative bg-white rounded-2xl shadow-xl p-8 cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center w-20 h-20 ${category.iconBg} rounded-2xl mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                >
                  <category.icon className={`w-10 h-10 ${category.iconColor}`} />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500 mb-4 italic">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                    {category.jobs.toLocaleString()}+
                  </div>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Open Positions
                  </span>
                </div>
              </div>

              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient}`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-12 py-5 rounded-full text-lg font-bold shadow-2xl transition-all duration-500 inline-flex items-center gap-3 overflow-hidden group"
          >
            <span className="relative z-10">View All Categories</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5 relative z-10" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Why Choose Section
const WhyChooseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const pieData = [
    { name: 'Excellent', value: 45, color: '#3B82F6' },
    { name: 'Great', value: 35, color: '#60A5FA' },
    { name: 'Good', value: 15, color: '#93C5FD' },
    { name: 'Average', value: 5, color: '#DBEAFE' },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified Talent Network',
      description: 'Access pre-screened candidates with verified skills and credentials for quality hires.',
      color: 'text-blue-600',
      borderColor: 'border-blue-500'
    },
    {
      icon: Sparkles,
      title: 'AI Matching Engine',
      description: 'Smart algorithms match you with the perfect opportunities based on your profile and preferences.',
      color: 'text-purple-600',
      borderColor: 'border-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Upskilling Opportunities',
      description: 'Learn in-demand skills with our certified courses and stay ahead in your career journey.',
      color: 'text-green-600',
      borderColor: 'border-green-500'
    },
    {
      icon: BarChart3,
      title: 'Career Growth Analytics',
      description: 'Track your applications, skills progress, and get personalized career insights.',
      color: 'text-orange-600',
      borderColor: 'border-orange-500'
    }
  ];

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-gradient-to-br from-[#F8FBFF] to-[#EAF6FF]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose VHireToday?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful candidates who found their dream careers through our platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Candidate Satisfaction
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name} - {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${feature.borderColor} transition-all duration-300`}
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    {
      icon: Users,
      label: 'Students Registered',
      value: 50000,
      suffix: '+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Briefcase,
      label: 'Jobs Posted',
      value: 15000,
      suffix: '+',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Building2,
      label: 'Companies Registered',
      value: 5000,
      suffix: '+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: FileText,
      label: 'Internships Applied',
      value: 100000,
      suffix: '+',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by thousands of students and companies worldwide
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const count = useCounter(stat.value, 2500, isInView);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-full mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {count.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Employers Section
const EmployersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: Target,
      title: 'Hire Top Talent',
      description: 'Connect with skilled professionals from top universities and training programs across the country.',
      color: 'text-blue-600',
      borderColor: 'border-blue-500'
    },
    {
      icon: CheckCircle,
      title: 'Verified Profiles',
      description: 'All candidates undergo thorough verification ensuring authentic credentials and genuine interest.',
      color: 'text-green-600',
      borderColor: 'border-green-500'
    },
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our intelligent system matches job requirements with candidate skills for perfect fit hires.',
      color: 'text-purple-600',
      borderColor: 'border-purple-500'
    },
    {
      icon: LineChart,
      title: 'Track Success Metrics',
      description: 'Monitor application rates, candidate quality, and hiring success with detailed analytics.',
      color: 'text-orange-600',
      borderColor: 'border-orange-500'
    }
  ];

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-gradient-to-br from-[#FEF9F5] to-[#FFF6EB]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Employers Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your hiring process and find the perfect candidates for your team
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${feature.borderColor} transition-all duration-300`}
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Post a Job
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};


// Main Component
const JobPortalSections = () => {
  return (
    <div className="min-h-screen">
      <WhyChooseSection />
      <StatsSection />
      <EmployersSection />
      <CategoriesSection />
    </div>
  );
};

export default JobPortalSections;
