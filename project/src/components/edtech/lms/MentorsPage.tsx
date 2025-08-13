import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Users, Calendar, Clock } from "lucide-react";
import { Teacher } from "../../../types";

const mockTeachers: Teacher[] = [
  {
    id: "1",
    userId: "user1",
    name: "Dr. Sarah Chen",
    bio: "AI researcher and educator with 10+ years of experience in machine learning and deep learning.",
    professionalBackground:
      "PhD in Computer Science from MIT, former Google AI researcher, published 50+ papers in top-tier conferences.",
    tags: ["AI", "Machine Learning", "Deep Learning", "Python"],
    expertise:
      "Specializing in neural networks, computer vision, and natural language processing.",
    isApproved: true,
    rating: 4.9,
    totalStudents: 1250,
    totalClasses: 45,
    createdAt: new Date(),
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    youtubeUrl: "https://youtube.com/c/sarahchen",
  },
  {
    id: "2",
    userId: "user2",
    name: "John Martinez",
    bio: "Full-stack developer and startup founder passionate about teaching modern web development.",
    professionalBackground:
      "Senior Engineer at Facebook, founded 2 successful startups, 8 years of industry experience.",
    tags: ["React", "Node.js", "JavaScript", "Web Development"],
    expertise:
      "Building scalable web applications with modern JavaScript frameworks.",
    isApproved: true,
    rating: 4.7,
    totalStudents: 890,
    totalClasses: 32,
    createdAt: new Date(),
    linkedinUrl: "https://linkedin.com/in/johnmartinez",
    youtubeUrl: "https://youtube.com/c/johnmartinez",
  },
  {
    id: "3",
    userId: "user3",
    name: "Maria Rodriguez",
    bio: "Professional chef and culinary instructor with expertise in international cuisine.",
    professionalBackground:
      "Graduate of Le Cordon Bleu, worked at Michelin-starred restaurants, 15 years of culinary experience.",
    tags: ["Cooking", "Baking", "International Cuisine", "Food Science"],
    expertise: "French cuisine, pastry arts, and molecular gastronomy.",
    isApproved: true,
    rating: 4.8,
    totalStudents: 650,
    totalClasses: 28,
    createdAt: new Date(),
    linkedinUrl: "https://linkedin.com/in/mariarodriguez",
    instagramUrl: "https://instagram.com/chef.maria",
  },
  {
    id: "4",
    userId: "user4",
    name: "David Thompson",
    bio: "Fitness trainer and nutrition expert helping people achieve their health goals.",
    professionalBackground:
      "NASM certified personal trainer, sports nutrition specialist, former competitive athlete.",
    tags: ["Fitness", "Nutrition", "Weight Training", "Cardio"],
    expertise: "Strength training, meal planning, and body transformation.",
    isApproved: true,
    rating: 4.6,
    totalStudents: 420,
    totalClasses: 18,
    createdAt: new Date(),
    linkedinUrl: "https://linkedin.com/in/davidthompson",
    instagramUrl: "https://instagram.com/fit.david",
  },
];

const MentorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [filteredMentors, setFilteredMentors] = useState(mockTeachers);

  const categories = [
    "all",
    "Technology",
    "Cooking",
    "Fitness",
    "Business",
    "Arts",
    "Music",
    "Languages",
    "Science",
    "Mathematics",
  ];

  useEffect(() => {
    let filtered = mockTeachers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((mentor) =>
        mentor.tags.some((tag) =>
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        filtered.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    setFilteredMentors(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/lms.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 chrome-text">
            Find Your Perfect Mentor
          </h1>
          <p className="text-silver text-lg">
            Connect with expert mentors across all subjects and skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="glass-panel p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-silver" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-silver/30 rounded-lg text-white placeholder-silver/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-silver" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-black"
                    >
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-8 py-3 bg-black/50 border border-silver/30 rounded-lg text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                >
                  <option value="rating" className="bg-black">
                    Highest Rated
                  </option>
                  <option value="students" className="bg-black">
                    Most Students
                  </option>
                  <option value="newest" className="bg-black">
                    Newest
                  </option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-silver text-sm">
              {filteredMentors.length} mentors found
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="glass-panel p-6 rounded-lg hover:bg-white/5 transition-colors"
              >
                {/* Mentor Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">
                      {mentor.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-silver">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{mentor.rating}</span>
                      <span>•</span>
                      <Users className="h-4 w-4" />
                      <span>{mentor.totalStudents} students</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-silver text-sm mb-4 line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                  {mentor.tags.length > 3 && (
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-silver">
                      +{mentor.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-silver mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{mentor.totalClasses} classes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Available</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
