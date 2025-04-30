import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  HeartHandshake,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  ActivitySquare,
  ClipboardList,
  Stethoscope,
  Bot,
  ChevronRight,
  Bell,
  Calendar,
  Heart,
  Moon,
  Sun,
  Droplet,
  Handshake,
  Utensils,
  Smile,
  Frown,
  Meh,
  ThermometerSun,
  Gamepad2,
  Zap,
  Coffee,
  Dumbbell,
  BookOpen,
  AlertCircle,
  CheckCircle,
  X,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  AlertTriangle,
  AppWindowMac,
  Pill,
  Apple,
  Bed,
  Brain,
  Droplets,
  Activity,
  Target,
  LineChart,
  BarChart,
  PieChart,
  Sparkles,
  Flame,
  Wind,
  Waves,
  Leaf,
  Sandwich,
  Salad,
  Milk,
  Egg,
  Fish,
  Carrot,
  Beef,
  Candy,
  Wine,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Calendar as CalendarIcon,
  Clock,
  Thermometer,
  Droplets as WaterIcon,
  Pill as MedicineIcon,
  Heart as HeartIcon,
  Brain as MoodIcon,
  Activity as ExerciseIcon,
  Sun as EnergyIcon,
  Moon as SleepIcon,
  Utensils as FoodIcon,
  AlertCircle as SymptomIcon,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { PrivacyForm } from "./PrivacyForm";

const server_url = import.meta.env.VITE_SERVER_URL;
const local_url = "http://localhost:3000/api/period/";

const cyclePhases = {
  menstrual: {
    name: "Menstrual",
    duration: [1, 5],
    symptoms: ["Cramps", "Fatigue", "Headache"],
    nutrition: ["Iron-rich foods", "Water", "Vitamin C"],
    exercise: ["Light walking", "Yoga", "Stretching"],
    mood: ["Rest", "Self-care", "Meditation"]
  },
  follicular: {
    name: "Follicular",
    duration: [6, 14],
    symptoms: ["Energy increase", "Improved mood", "Higher motivation"],
    nutrition: ["Protein-rich foods", "Antioxidants", "B vitamins"],
    exercise: ["High-intensity workouts", "Strength training", "Cardio"],
    mood: ["Goal setting", "New projects", "Social activities"]
  },
  ovulatory: {
    name: "Ovulatory",
    duration: [15, 17],
    symptoms: ["Increased energy", "Enhanced mood", "Mild pain"],
    nutrition: ["Zinc-rich foods", "Magnesium", "Fermented foods"],
    exercise: ["Peak performance activities", "Team sports", "Dancing"],
    mood: ["Communication", "Creativity", "Leadership"]
  },
  luteal: {
    name: "Luteal",
    duration: [18, 28],
    symptoms: ["Bloating", "Mood changes", "Food cravings"],
    nutrition: ["Complex carbs", "Calcium-rich foods", "Omega-3"],
    exercise: ["Moderate intensity", "Swimming", "Pilates"],
    mood: ["Organization", "Reflection", "Mindfulness"]
  }
};

const nutritionTracking = {
  categories: [
    { name: "Proteins", icon: <Egg />, target: "50-60g" },
    { name: "Iron", icon: <Beef />, target: "18mg" },
    { name: "Calcium", icon: <Milk />, target: "1000mg" },
    { name: "Vitamins", icon: <Carrot />, target: "varied" },
    { name: "Water", icon: <Droplets />, target: "2-3L" }
  ]
};

// Add new constants for tracking
const symptomCategories = {
  physical: ["Cramps", "Headache", "Bloating", "Breast Tenderness", "Fatigue", "Back Pain"],
  emotional: ["Anxiety", "Mood Swings", "Irritability", "Depression", "Stress"],
  digestive: ["Nausea", "Appetite Changes", "Constipation", "Diarrhea"],
  skin: ["Acne", "Skin Changes", "Oily Skin", "Dry Skin"],
  sleep: ["Insomnia", "Oversleeping", "Disturbed Sleep", "Night Sweats"]
};

const moodTypes = {
  positive: ["Happy", "Energetic", "Calm", "Focused", "Confident"],
  neutral: ["Normal", "Stable", "Indifferent"],
  negative: ["Anxious", "Irritable", "Sad", "Stressed", "Overwhelmed"]
};

const energyLevels = ["Very Low", "Low", "Moderate", "High", "Very High"];

export function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMythModal, setShowMythModal] = useState(false);
  const [currentMyth, setCurrentMyth] = useState(null);
  const [periodData, setPeriodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [cycleDay, setCycleDay] = useState(1);
  const [selectedData, setSelectedData] = useState({
    cycleInfo: true,
    moodData: true,
    sleepData: true,
    symptomsData: true,
    wellnessData: true,
  });
  const [showPrivacyForm, setShowPrivacyForm] = useState(false);
  const [nutritionLog, setNutritionLog] = useState([]);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showPhaseInfo, setShowPhaseInfo] = useState(false);
  const [showNutritionLog, setShowNutritionLog] = useState(false);
  const [currentPhaseData, setCurrentPhaseData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [energyHistory, setEnergyHistory] = useState([]);
  const [medicationLog, setMedicationLog] = useState([]);
  const [sleepQualityHistory, setSleepQualityHistory] = useState([]);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [activeSymptomCategory, setActiveSymptomCategory] = useState("physical");
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define getCurrentPhase function before using it in useEffect
  const getCurrentPhase = (day) => {
    if (!day) return "menstrual";
    if (day <= 5) return "menstrual";
    if (day <= 14) return "follicular";
    if (day <= 17) return "ovulatory";
    return "luteal";
  };

  // Calculate cycle day whenever periodData changes
  useEffect(() => {
    if (periodData && periodData.lastPeriodStart) {
      const daysSinceStart = Math.floor(
        (new Date() - new Date(periodData.lastPeriodStart)) /
        (1000 * 60 * 60 * 24)
      );
      const calculatedCycleDay = (daysSinceStart % (periodData.cycleDuration || 28)) + 1;
      setCycleDay(calculatedCycleDay);
    }
  }, [periodData]);

  // Update current phase data when cycle day changes
  useEffect(() => {
    if (cycleDay) {
      const currentPhase = getCurrentPhase(cycleDay);
      setCurrentPhaseData(cyclePhases[currentPhase.toLowerCase()]);
    }
  }, [cycleDay]);

  // Add new useEffect for loading historical data
  useEffect(() => {
    if (periodData) {
      // Initialize histories with any existing data
      if (periodData.symptomHistory) {
        setSymptomHistory(periodData.symptomHistory);
      }
      if (periodData.moodHistory) {
        setMoodHistory(periodData.moodHistory);
      }
      if (periodData.energyHistory) {
        setEnergyHistory(periodData.energyHistory);
      }
      if (periodData.medicationLog) {
        setMedicationLog(periodData.medicationLog);
      }
      if (periodData.sleepQualityHistory) {
        setSleepQualityHistory(periodData.sleepQualityHistory);
      }
    }
  }, [periodData]);

  const fallbackData = {
    cycleDuration: 28,
    lastPeriodStart: new Date(
      Date.now() - 15 * 24 * 60 * 60 * 1000
    ).toISOString(),
    lastPeriodDuration: 5,
    moodTypes: ["Happy", "Anxious", "Irritable"],
    moodSeverity: "Moderate",
    moodDate: new Date().toISOString(),
    symptoms: ["Cramps", "Bloating", "Headache"],
    symptomSeverities: {
      Cramps: "Severe",
      Bloating: "Moderate",
      Headache: "Mild",
    },
    symptomDate: new Date().toISOString(),
    sleepDuration: 7.5,
    sleepQuality: "Good",
    nextPeriodPrediction: new Date(
      Date.now() + 13 * 24 * 60 * 60 * 1000
    ).toISOString(),
    currentPhase: "Luteal",
  };

  useEffect(() => {
    const fetchPeriodData = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setError("token not found. Please log in.");
        setLoading(false);
        return;
      }

      const fetchWithTimeout = async (url, timeout) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const response = await axios.get(
            `${url}api/period/periodtracking/${userId}`,
            {
              signal: controller.signal,
              headers: {
                "Content-Type": "application/json",
                Authorization: `${localStorage.getItem("token") || ""}`, // Ensure token exists
              },
            }
          );
          clearTimeout(id);
          return response.data;
        } catch (error) {
          if (error.name === "AbortError") {
            throw new Error("Request timed out");
          }
          if (error.code === "ERR_BAD_REQUEST") {
            navigate("/tracker");
            console.log(error.code);
            throw new Error("Period Data not found");
          }
          console.log(error.code);
          throw error;
        }
      };

      try {
        // Try server URL first
        const data = await fetchWithTimeout(server_url, 5000); // 5 second timeout
        setPeriodData(data.periodTrackingData);
        setWaterIntake(data.periodTrackingData.waterIntakeCount);
        setError(null);
      } catch (serverError) {
        console.error("Error fetching from server:", serverError);
        try {
          // Fallback to local URL
          const data = await fetchWithTimeout(local_url, 5000); // 5 second timeout
          setPeriodData(data.periodTrackingData);
          setError("Using local data due to server unavailability.");
        } catch (localError) {
          console.error("Error fetching from local:", localError);
          setPeriodData(fallbackData);
          setError("Failed to fetch data. Using sample data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, [server_url, local_url]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const notificationInterval = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 30000);
    return () => clearInterval(notificationInterval);
  }, []);

  const handleWaterIntake = () => {
    const userId = localStorage.getItem("userId");
    if (waterIntake < 8) {
      setWaterIntake((prev) => Math.min(prev + 1, 8));
      const response = axios.get(
        `${server_url}api/period/waterupdate/${userId}`
      );
      console.log("Water intake logged:", response);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleDataSelection = (dataType) => {
    setSelectedData((prev) => ({
      ...prev,
      [dataType]: !prev[dataType],
    }));
  };

  const handleSavePrivacySettings = (settings) => {
    console.log("Privacy settings saved:", settings);
    // Here you would typically send these settings to your backend
    setShowPrivacyForm(false);
  };

  const sendSOSEmails = async () => {
    const formspreeEndpoints = [
      "https://formspree.io/f/mqaagdkg",
      "https://formspree.io/f/xyzzbdzo",
      "https://formspree.io/f/mbllpado",
    ];

    const emailBody = {
      subject: "SOS Alert",
      message:
        "This is an SOS alert generated by SARAH KHAN from the SheSync app.",
    };

    try {
      const promises = formspreeEndpoints.map((endpoint) =>
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailBody),
        })
      );

      await Promise.all(promises);
      alert("SOS alerts sent successfully!");
    } catch (error) {
      console.error("Error sending SOS alerts:", error);
      alert("Failed to send SOS alerts. Please try again.");
    }
  };

  const myths = [
    {
      myth: "You can't get pregnant during your period.",
      fact: "While it's less likely, you can still get pregnant during your period, especially if you have a shorter menstrual cycle.",
    },
    {
      myth: "PMS is all in your head.",
      fact: "PMS is a real medical condition caused by hormonal changes during the menstrual cycle.",
    },
    {
      myth: "Irregular periods always indicate a serious problem.",
      fact: "While irregular periods can sometimes signal health issues, they can also be caused by stress, diet, or exercise changes.",
    },
    {
      myth: "You shouldn't exercise during your period.",
      fact: "Exercise can actually help alleviate period symptoms like cramps and mood swings.",
    },
    {
      myth: "Using tampons can cause you to lose your virginity.",
      fact: "Using tampons does not affect virginity, which is about sexual intercourse, not physical changes to the body.",
    },
  ];

  const openMythModal = (myth) => {
    setCurrentMyth(myth);
    setShowMythModal(true);
  };

  // Add new helper functions
  const getSymptomFrequency = () => {
    return symptomHistory.reduce((acc, record) => {
      record.symptoms.forEach(symptom => {
        acc[symptom] = (acc[symptom] || 0) + 1;
      });
      return acc;
    }, {});
  };

  const getMoodTrend = () => {
    const recentMoods = moodHistory.slice(-7);
    const positiveCount = recentMoods.filter(mood => 
      moodTypes.positive.includes(mood.type)
    ).length;
    const negativeCount = recentMoods.filter(mood => 
      moodTypes.negative.includes(mood.type)
    ).length;
    
    return {
      trend: positiveCount > negativeCount ? "improving" : "declining",
      positivePercentage: (positiveCount / recentMoods.length) * 100
    };
  };

  const getAverageSleepQuality = () => {
    if (!sleepQualityHistory.length) return "No Data";
    const sum = sleepQualityHistory.reduce((acc, record) => acc + record.quality, 0);
    return (sum / sleepQualityHistory.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Fetching your Data...</p>
        </div>
      </div>
    );
  }

  if (!periodData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please sign in to access your personalized dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const daysUntilNextPeriod = periodData.cycleDuration - cycleDay;
  const fertileWindow = cycleDay >= 11 && cycleDay <= 17;
  const pmsLikely = periodData.currentPhase === "Luteal" && cycleDay > 21;
  const wellRested =
    periodData.sleepQuality === "Good" && periodData.sleepDuration >= 7;

  const getHealthTips = () => {
    const tips = [
      "Stay hydrated! Aim for 8 glasses of water a day.",
      "Practice deep breathing exercises for stress relief.",
      "Incorporate more leafy greens into your diet for iron.",
      "Try a warm compress for cramp relief.",
      "Get moving with light exercise like yoga or walking.",
    ];
    return tips.slice(0, 3);
  };

  const healthTips = getHealthTips();

  const getPersonalizedRecommendations = () => {
    if (!currentPhaseData) return [];
    
    const recommendations = [
      {
        category: "Nutrition",
        items: currentPhaseData.nutrition.map(item => ({
          text: item,
          icon: <Apple className="h-5 w-5 text-green-500" />
        }))
      },
      {
        category: "Exercise",
        items: currentPhaseData.exercise.map(item => ({
          text: item,
          icon: <Activity className="h-5 w-5 text-blue-500" />
        }))
      },
      {
        category: "Mood Support",
        items: currentPhaseData.mood.map(item => ({
          text: item,
          icon: <Brain className="h-5 w-5 text-purple-500" />
        }))
      }
    ];
    return recommendations;
  };

  const handleNutritionLog = (category, value) => {
    setNutritionLog(prev => [...prev, { category, value, timestamp: new Date() }]);
  };

  const handleExerciseLog = (type, duration) => {
    setExerciseLog(prev => [...prev, { type, duration, timestamp: new Date() }]);
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const PhaseInfoCard = () => (
    <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{currentPhaseData?.name} Phase</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Day {cycleDay} of your cycle</p>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {currentPhaseData?.symptoms.map((symptom, index) => (
          <div key={index} className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <Target className="h-5 w-5 text-pink-500" />
            <span>{symptom}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  const NutritionTracker = () => (
    <Card>
      <h3 className="font-semibold mb-4 flex items-center">
        <Apple className="h-5 w-5 mr-2 text-green-500" />
        Nutrition Tracking
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {nutritionTracking.categories.map((category, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <div className="text-xs text-gray-500">Target: {category.target}</div>
            <button
              onClick={() => handleNutritionLog(category.name, "consumed")}
              className="mt-2 w-full px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-xs"
            >
              Log Intake
            </button>
          </div>
        ))}
      </div>
    </Card>
  );

  const SymptomTracker = () => (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Symptom Tracker</h3>
        <button
          onClick={() => setShowSymptomModal(true)}
          className="text-pink-500 hover:text-pink-600"
        >
          + Add Symptoms
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Object.keys(symptomCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveSymptomCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeSymptomCategory === category
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {symptomCategories[activeSymptomCategory].map(symptom => (
            <div
              key={symptom}
              className={`p-3 rounded-lg border ${
                selectedSymptoms.includes(symptom)
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              onClick={() => handleSymptomToggle(symptom)}
            >
              <div className="flex items-center space-x-2">
                <SymptomIcon className="h-4 w-4 text-pink-500" />
                <span className="text-sm">{symptom}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const MoodEnergyTracker = () => {
    const moodTrend = getMoodTrend();
    
    return (
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Mood Tracking</h3>
            <div className="space-y-3">
              {Object.entries(moodTypes).map(([category, moods]) => (
                <div key={category}>
                  <h4 className="text-sm text-gray-500 mb-2">{category.toUpperCase()}</h4>
                  <div className="flex flex-wrap gap-2">
                    {moods.map(mood => (
                      <button
                        key={mood}
                        onClick={() => setMoodHistory(prev => [...prev, { type: mood, date: new Date() }])}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Energy Level</h3>
            <div className="space-y-2">
              {energyLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setEnergyHistory(prev => [...prev, { level, date: new Date() }])}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>{level}</span>
                  <EnergyIcon className="h-4 w-4 text-yellow-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const CycleInsights = () => {
    const daysUntilNextPeriod = periodData.cycleDuration - cycleDay;
    
    return (
      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Cycle Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Phase</span>
              <CalendarIcon className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-lg font-semibold">{currentPhaseData?.name || "Loading..."}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Days Until Next Period</span>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-lg font-semibold">{daysUntilNextPeriod} days</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Cycle Length</span>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-lg font-semibold">{periodData.cycleDuration} days</p>
          </div>
        </div>
      </Card>
    );
  };

  const HealthStats = () => (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Health Statistics</h3>
        <button
          onClick={() => setShowDetailedStats(!showDetailedStats)}
          className="text-pink-500 hover:text-pink-600"
        >
          {showDetailedStats ? "Show Less" : "Show More"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Sleep Quality"
          value={getAverageSleepQuality()}
          icon={<SleepIcon className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          title="Water Intake"
          value={`${waterIntake}/8`}
          icon={<WaterIcon className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Mood Trend"
          value={getMoodTrend().trend}
          icon={<MoodIcon className="h-5 w-5 text-yellow-500" />}
        />
        <StatCard
          title="Active Symptoms"
          value={selectedSymptoms.length}
          icon={<SymptomIcon className="h-5 w-5 text-red-500" />}
        />
      </div>
      {showDetailedStats && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3">Symptom Frequency</h4>
              {Object.entries(getSymptomFrequency()).map(([symptom, count]) => (
                <div key={symptom} className="flex items-center justify-between mb-2">
                  <span className="text-sm">{symptom}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 rounded-full h-2"
                      style={{ width: `${(count / symptomHistory.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Recent Medications</h4>
              {medicationLog.slice(-5).map((med, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <MedicineIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{med.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(med.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  // Add StatCard component
  const StatCard = ({ title, value, icon }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideOut {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        :root {
          --background: 255, 255, 255;
          --foreground: 33, 33, 33;
          --primary: 255, 105, 180;
          --primary-foreground: 0, 0, 0;
          --card: 255, 255, 255;
          --card-foreground: 0, 0, 0;
          --muted: 240, 240, 240;
          --muted-foreground: 75, 75, 75;
        }
        .dark {
          --background: 23, 23, 23;
          --foreground: 255, 255, 255;
          --primary: 255, 105, 180;
          --primary-foreground: 255, 255, 255;
          --card: 38, 38, 38;
          --card-foreground: 255, 255, 255;
          --muted: 50, 50, 50;
          --muted-foreground: 150, 150, 150;
        }
        body {
          background-color: rgb(var(--background));
          color: rgb(var(--foreground));
        }
      `}</style>
      <aside
        className={`w-[240px] bg-pink-100 dark:bg-gray-800  flex flex-col transition-all duration-300 ease-in-out ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="px-4 py-4 flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-4 ml-4">
            SheSync
          </h1>
          <nav className="px-4 py-4 flex flex-col space-y-2">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              onClick={() => navigate("/dashboard")}
              active
            />
            <NavItem
              icon={<Home size={20} />}
              label="Home"
              onClick={() => navigate("/")}
            />
            <NavItem
              icon={<GraduationCap size={20} />}
              label="Education"
              onClick={() => navigate("/blogs")}
            />
            <NavItem
              icon={<ShoppingBag size={20} />}
              label="Shop"
              onClick={() => navigate("/Ecom")}
            />
            <NavItem
              icon={<ActivitySquare size={20} />}
              label="Track Your Health"
              onClick={() => navigate("/tracker")}
            />
            <NavItem
              icon={<ClipboardList size={20} />}
              label="PCOS Diagnosis"
              onClick={() => navigate("/partner")}
            />
            <NavItem
              icon={<Stethoscope size={20} />}
              label="ExpertConsultation"
              onClick={() => navigate("/consultations")}
            />
            <NavItem
              icon={<Bot size={20} />}
              label="Eve"
              onClick={() => navigate("/ChatBot")}
            />
            <NavItem
              icon={<HeartPulse size={20} />}
              label="HealthLens"
              onClick={() => navigate("/symptomsanalyzer")}
            />
            
            <NavItem
              icon={<MessageSquare size={20} />}
              label="Forums"
              onClick={() => navigate("/forums")}
            />
            <NavItem
                            icon={<Gamepad2 size={20} />}
                            label="Bliss"
                            onClick={() =>
                              window.open(
                                "http://localhost:5500/game-main/index.html","_self"
                                
                              )
                            }
                          />
            
          </nav>
        </div>
        <div className="pt-6 mt-6 border-t border-[rgba(var(--foreground),0.1)]">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-half bg-[rgba(var(--foreground),0.1)] flex items-center justify-center text-sm font-medium">
              ☮️
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">SheSync🎗️</p>
              <p className="text-xs text-[rgba(var(--foreground),0.6)]">
                Premium Member
              </p>
            </div>
            <ChevronRight
              size={16}
              className="ml-auto text-[rgba(var(--foreground),0.4)]"
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[rgb(var(--background))] transition-all duration-300 ease-in-out">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {error && (
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
              role="alert"
            >
              <p className="font-bold">Note</p>
              <p>{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between p-4 bg-[var(--fc-accent)] shadow-md">
            <h2 className="text-lg text-pink-600 font-bold">Dashboard</h2>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-[rgb(var(--muted-foreground))]" />
              <button
                onClick={() => setShowPrivacyForm(!showPrivacyForm)}
                className="p-2 rounded-full bg-[rgba(var(--foreground),0.1)] text-[rgb(var(--foreground))] transition-transform hover:scale-110"
              >
                {showPrivacyForm ? <Unlock size={20} /> : <Lock size={20} />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-[rgba(var(--foreground),0.1)] text-[rgb(var(--foreground))] transition-transform hover:scale-110"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={sendSOSEmails}
                className="p-2 rounded-full bg-red-500 text-white transition-transform hover:scale-110"
              >
                <AlertTriangle size={20} />
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === "insights"}
              onClick={() => setActiveTab("insights")}
            >
              Insights
            </TabButton>
            <TabButton
              active={activeTab === "mythbusters"}
              onClick={() => setActiveTab("mythbusters")}
            >
              MythBusters
            </TabButton>
          </div>

          {showPrivacyForm && (
            <Card className="mb-6">
              <PrivacyForm onSave={handleSavePrivacySettings} />
            </Card>
          )}

          {activeTab === "overview" && (
            <>
              <Card className="overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">
                      Cycle Day {cycleDay}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-lg font-semibold mb-2">
                    Current Phase: {periodData.currentPhase}
                  </p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    {daysUntilNextPeriod} days until next period
                  </p>
                  <div className="mt-4 h-2 bg-[rgba(var(--primary),0.2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgb(var(--primary))]"
                      style={{
                        width: `${
                          (cycleDay / periodData.cycleDuration) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatedCard
                  title="Mood"
                  value={periodData.moodTypes[0]}
                  icon={getMoodIcon(periodData.moodTypes[0])}
                />
                <AnimatedCard
                  title="Sleep Quality"
                  value={periodData.sleepQuality}
                  icon={<Moon className="h-6 w-6" />}
                />
                <AnimatedCard
                  title="Active Symptoms"
                  value={periodData.symptoms.length}
                  icon={<ThermometerSun className="h-6 w-6" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold mb-4">Daily Health Tips</h3>
                  <ul className="space-y-2">
                    {healthTips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start animate-float"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <Utensils className="h-5 w-5 text-[rgb(var(--primary))] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <h3 className="font-semibold mb-4">Water Intake Tracker</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span>Goal: 8 glasses</span>
                    <span>{waterIntake} / 8</span>
                  </div>
                  <div className="h-4 bg-[rgba(var(--primary),0.2)] rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-[rgb(var(--primary))]"
                      style={{ width: `${(waterIntake / 8) * 100}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={handleWaterIntake}
                    className="w-full py-2 px-4 bg-[rgb(var(--primary))] text-white rounded-md hover:bg-[rgba(var(--primary),0.8)] transition-colors"
                  >
                    Log Water Intake
                  </button>
                </Card>
              </div>

              <Card>
                <h3 className="font-semibold mb-4">Wellness Tracker</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <WellnessItem
                    title="Energy"
                    value={periodData.moodSeverity}
                    icon={<Zap className="h-5 w-5" />}
                  />
                  <WellnessItem
                    title="Stress"
                    value={
                      periodData.moodSeverity === "Moderate"
                        ? "Low"
                        : "Moderate"
                    }
                    icon={<Coffee className="h-5 w-5" />}
                  />
                  <WellnessItem
                    title="Exercise"
                    value="30 min"
                    icon={<Dumbbell className="h-5 w-5" />}
                  />
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Upcoming Events</h3>
                <ul className="space-y-2">
                  <EventItem
                    title="Doctor's Appointment"
                    date="Tomorrow, 10:00 AM"
                  />
                  <EventItem title="Yoga Class" date="Wednesday, 6:00 PM" />
                  <EventItem
                    title="Period Start Date"
                    date={`In ${daysUntilNextPeriod} days`}
                  />
                </ul>
              </Card>
            </>
          )}

          {activeTab === "insights" && (
            <>
              <Card>
                <h3 className="font-semibold mb-4">Health Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InsightItem
                    title="Fertility Window"
                    value={fertileWindow ? "Active" : "Inactive"}
                    icon={
                      <Calendar className="h-5 w-5 text-[rgb(var(--primary))]" />
                    }
                  />
                  <InsightItem
                    title="PMS Likelihood"
                    value={pmsLikely ? "High" : "Low"}
                    icon={
                      <ActivitySquare className="h-5 w-5 text-[rgb(var(--primary))]" />
                    }
                  />
                  <InsightItem
                    title="Rest Status"
                    value={wellRested ? "Well Rested" : "Need More Rest"}
                    icon={
                      <Moon className="h-5 w-5 text-[rgb(var(--primary))]" />
                    }
                  />
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Cycle Analysis</h3>
                <div className="space-y-4">
                  <p>Your cycle length: {periodData.cycleDuration} days</p>
                  <p>Average cycle length: 28 days</p>
                  <p>Your current phase: {periodData.currentPhase}</p>
                  <p>Days until next period: {daysUntilNextPeriod}</p>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Symptom Trends</h3>
                <ul className="space-y-2">
                  {periodData.symptoms.map((symptom, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{symptom}</span>
                      <span className="text-[rgb(var(--muted-foreground))]">
                        {periodData.symptomSeverities instanceof Map
                          ? periodData.symptomSeverities.get(symptom)
                          : periodData.symptomSeverities[symptom]}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Data Sharing Settings</h3>
                <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
                  Select the data you want to share with the Parent's Dashboard:
                </p>
                <div className="space-y-4">
                  <DataToggle
                    label="Cycle Information"
                    isSelected={selectedData.cycleInfo}
                    onToggle={() => toggleDataSelection("cycleInfo")}
                  />
                  <DataToggle
                    label="Mood Data"
                    isSelected={selectedData.moodData}
                    onToggle={() => toggleDataSelection("moodData")}
                  />
                  <DataToggle
                    label="Sleep Data"
                    isSelected={selectedData.sleepData}
                    onToggle={() => toggleDataSelection("sleepData")}
                  />
                  <DataToggle
                    label="Symptoms Data"
                    isSelected={selectedData.symptomsData}
                    onToggle={() => toggleDataSelection("symptomsData")}
                  />
                  <DataToggle
                    label="Wellness Data"
                    isSelected={selectedData.wellnessData}
                    onToggle={() => toggleDataSelection("wellnessData")}
                  />
                </div>
              </Card>
            </>
          )}

          {activeTab === "mythbusters" && (
            <Card>
              <h3 className="font-semibold mb-4">
                Menstrual Health MythBusters
              </h3>
              <div className="space-y-4">
                {myths.map((myth, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[rgba(var(--primary),0.1)] rounded-lg"
                  >
                    <p className="font-medium mb-2">{myth.myth}</p>
                    <button
                      onClick={() => openMythModal(myth)}
                      className="text-[rgb(var(--primary))] hover:underline"
                    >
                      Reveal the truth
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <CycleInsights />
          <HealthStats />
          <SymptomTracker />
          <MoodEnergyTracker />
        </div>
      </main>

      {showNotification && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-[rgb(var(--primary))] text-white p-4 rounded-b-lg shadow-lg animate-slideIn">
          don't forget to log your symptoms today!
        </div>
      )}

      {showMythModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[rgb(var(--card))] p-6 rounded-lg max-w-md w-full">
            <h4 className="font-semibold mb-2">Myth: {currentMyth.myth}</h4>
            <p className="mb-4">Fact: {currentMyth.fact}</p>
            <button
              onClick={() => setShowMythModal(false)}
              className="w-full py-2 px-4 bg-[rgb(var(--primary))] text-white rounded-md hover:bg-[rgba(var(--primary),0.8)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSymptomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-semibold mb-4">Log Symptoms</h3>
            <div className="space-y-4">
              {/* Add symptom logging form */}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSymptomModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle symptom logging
                  setShowSymptomModal(false);
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label, onClick, active = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 w-full px-2 py-2 rounded-lg transition-colors ${
        active
          ? "bg-pink-200 dark:bg-pink-900 text-pink-800 dark:text-pink-200"
          : "text-gray-900 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--card))] rounded-lg p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

const AnimatedCard = ({ title, value, icon, description }) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md hover:scale-105">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {description && (
            <p className="text-xs text-[rgb(var(--muted-foreground))] mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="p-2 bg-[rgba(var(--primary),0.1)] rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const getMoodIcon = (mood) => {
  if (typeof mood == "string") {
    switch (mood.toLowerCase()) {
      case "happy":
        return <Smile className="h-6 w-6 text-green-500" />;
      case "sad":
        return <Frown className="h-6 w-6 text-blue-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  }
};

const InsightItem = ({ title, value, icon }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-[rgba(var(--primary),0.1)] rounded-lg transition-all duration-300 hover:bg-[rgba(var(--primary),0.2)]">
      {icon}
      <div>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

const WellnessItem = ({ title, value, icon }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-[rgba(var(--primary),0.1)] rounded-lg">
      <div className="p-2 bg-[rgba(var(--primary),0.2)] rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

const EventItem = ({ title, date }) => {
  return (
    <li className="flex items-center space-x-3">
      <Calendar className="h-5 w-5 text-[rgb(var(--primary))]" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">{date}</p>
      </div>
    </li>
  );
};

const TabButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${
        active
          ? "bg-[rgb(var(--primary))] text-white"
          : "bg-[rgba(var(--foreground),0.1)] text-[rgb(var(--muted-foreground))] hover:bg-[rgba(var(--foreground),0.2)]"
      }`}
    >
      {children}
    </button>
  );
};

const DataToggle = ({ label, isSelected, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <button
        onClick={onToggle}
        className="focus:outline-none"
        aria-label={`Toggle ${label}`}
      >
        {isSelected ? (
          <ToggleRight className="h-6 w-6 text-[rgb(var(--primary))]" />
        ) : (
          <ToggleLeft className="h-6 w-6 text-[rgb(var(--muted-foreground))]" />
        )}
      </button>
    </div>
  );
};

// export default Dashboard;
