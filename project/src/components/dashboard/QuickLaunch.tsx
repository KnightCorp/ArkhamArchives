import React, { useState, useEffect } from "react";
import {
  Crown,
  BookOpen,
  Bell,
  Compass,
  Search,
  TrendingUp,
  GraduationCap,
  Building,
  Users,
  Truck,
  Home,
  Zap,
  Camera,
  LogOut,
  Shield,
  ChevronRight,
  ChevronLeft,
  Play,
  Info,
  X,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../lib/supabaseClient";

interface App {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<any>;
  status: "available" | "coming-soon" | "unreleased";
  district: string;
  heroVideo: string;
  cardVideo: string;
  color: string;
  path?: string;
}

interface QuickLaunchProps {
  logout?: () => void;
}

const QuickLaunch: React.FC<QuickLaunchProps> = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const { user, signOut } = useAuth();

  const apps: App[] = [
    {
      id: "monarch-studio",
      name: "Monarch Studio",
      description: "Media sharing platform and AI content generation studio",
      longDescription:
        "In the Creative District, where shadows dance with light, artists forge their darkest visions into reality. Monarch Studio stands as the crown jewel of digital creation.",
      icon: Crown,
      status: "coming-soon",
      district: "Creative District",
      heroVideo:
        "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-purple-900 to-black",
    },
    {
      id: "chronicles",
      name: "Chronicles",
      description: "Your personal social journal app",
      longDescription:
        "Deep within the City Center, where memories are preserved like ancient relics, Chronicles serves as your personal grimoire of experiences.",
      icon: BookOpen,
      status: "available",
      district: "City Center",
      heroVideo:
        "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-red-900 to-black",
      path: "/social",
    },
    {
      id: "the-belfry",
      name: "The Belfry",
      description: "AI notetaking, project management & productivity",
      longDescription:
        "Rising above the Industrial District like a gothic cathedral, The Belfry orchestrates the symphony of productivity with supernatural precision.",
      icon: Bell,
      status: "coming-soon",
      district: "Industrial District",
      heroVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "discover-lounge",
      name: "Discover Lounge",
      description: "Luxury experiences, fashion & AI auction thrift store",
      longDescription:
        "In the opulent Entertainment District, where luxury meets mystery, the Discover Lounge curates treasures from the shadows of high society.",
      icon: Compass,
      status: "coming-soon",
      district: "Entertainment District",
      heroVideo:
        "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-indigo-900 to-black",
    },
    {
      id: "arkham-research",
      name: "Arkham Research",
      description: "AI search, research, automation & collaborative platform",
      longDescription:
        "Within the hallowed halls of the I-Hub, scholars delve into forbidden knowledge, pushing the boundaries of what mortals should know.",
      icon: Search,
      status: "coming-soon",
      district: "I-Hub",
      heroVideo:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-green-900 to-black",
    },
    {
      id: "arkham-xchange",
      name: "Arkham Xchange",
      description: "Social investing platform",
      longDescription:
        "The Financial District stands as a monument to dark capitalism, where fortunes are made and lost in the shadows of the market.",
      icon: TrendingUp,
      status: "coming-soon",
      district: "Financial District",
      heroVideo:
        "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-yellow-900 to-black",
    },
    {
      id: "arkham-uni",
      name: "Arkham Uni",
      description: "Immersive and social learning platform",
      longDescription:
        "The University Grounds echo with centuries of learning, where knowledge transforms souls and wisdom comes at a price few are willing to pay.",
      icon: GraduationCap,
      status: "coming-soon",
      district: "University Grounds",
      heroVideo:
        "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-blue-900 to-black",
    },
    {
      id: "city-hall-district",
      name: "City Hall District",
      description: "Government buildings and civic administration",
      longDescription:
        "The seat of power in Arkham, where political machinations unfold in shadowed corridors of marble and stone.",
      icon: Building,
      status: "unreleased",
      district: "City Hall District",
      heroVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "chinatown",
      name: "Chinatown",
      description: "Cultural enclave with traditional architecture",
      longDescription:
        "Ancient traditions meet modern mysteries in the narrow alleys where lanterns cast dancing shadows.",
      icon: Users,
      status: "unreleased",
      district: "Chinatown",
      heroVideo:
        "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "docklands",
      name: "Docklands",
      description: "Waterfront industrial and shipping district",
      longDescription:
        "Where fog-shrouded piers hide secrets from across the dark waters, and cargo holds mysteries from distant shores.",
      icon: Truck,
      status: "unreleased",
      district: "Docklands",
      heroVideo:
        "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "old-district",
      name: "Old District",
      description: "Historic quarter with colonial architecture",
      longDescription:
        "The ancient heart of the city, where cobblestone streets echo with centuries of whispered secrets.",
      icon: Home,
      status: "unreleased",
      district: "Old District",
      heroVideo:
        "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "toxic-district",
      name: "Toxic District",
      description: "Industrial wasteland and abandoned factories",
      longDescription:
        "A forsaken realm where chemical shadows dance and the very air whispers of forgotten experiments.",
      icon: Zap,
      status: "unreleased",
      district: "Toxic District",
      heroVideo:
        "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
    {
      id: "botany-district",
      name: "The Botany District",
      description: "Botanical gardens and research facilities",
      longDescription:
        "Where nature's darkest secrets bloom in moonlit conservatories and twisted vines hide ancient knowledge.",
      icon: Camera,
      status: "unreleased",
      district: "The Botany District",
      heroVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cardVideo:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop",
      color: "from-gray-900 to-black",
    },
  ];

  // Check admin status from database
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setAdminLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
        }
      } catch (err) {
        console.error("Unexpected error checking admin status:", err);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % apps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handle logout with Supabase signOut
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEnterDistrict = (app: App) => {
    if (app.status === "available" && app.path) {
      window.location.href = app.path;
    }
  };

  const currentHeroApp = apps[heroIndex];
  const districts = [
    "Creative District",
    "City Center",
    "Industrial District",
    "Entertainment District",
    "I-Hub",
    "Financial District",
    "University Grounds",
    "City Hall District",
    "Chinatown",
    "Docklands",
    "Old District",
    "Toxic District",
    "The Botany District",
  ];
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-wider">
                ARKHAM ARCHIVES
              </span>
            </div>
            <div className="flex gap-2">
              {/* Logout button */}
              <button
                className="flex gap-2 items-center bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Admin status indicator */}
              {adminLoading ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 rounded-lg">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                  <span className="hidden sm:inline text-gray-300">
                    Checking...
                  </span>
                </div>
              ) : (
                isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="hidden sm:inline text-green-300">
                      Admin
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen pt-20">
        <div className="video-background">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="video-bg"
            onError={(e) => console.error("Video failed to load:", e)}
            onCanPlay={() => console.log("Video can play")}
            onLoadedData={() => console.log("Video loaded")}
          >
            <source src="/quicklaunch.mp4" type="video/mp4" />
            <p>Your browser doesn't support HTML video.</p>
          </video>
        </div>

        <div className="video-overlay"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <MapPin className="w-6 h-6 text-gray-300" />
                  <span className="text-sm uppercase tracking-widest text-gray-300 font-light">
                    {currentHeroApp.district}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <currentHeroApp.icon className="w-12 h-12 text-white" />
                  <div>
                    <h1 className="text-7xl font-bold tracking-tight text-white">
                      {currentHeroApp.name}
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-gray-200 leading-relaxed mb-8 font-light">
                  {currentHeroApp.longDescription}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  className={`flex items-center space-x-3 px-10 py-4 font-semibold tracking-wide border-2 transition-all duration-300 ${
                    currentHeroApp.status === "available"
                      ? "bg-white text-black border-white hover:bg-gray-100"
                      : "bg-gray-600 text-gray-300 border-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    currentHeroApp.status === "available" &&
                    handleEnterDistrict(currentHeroApp)
                  }
                  disabled={currentHeroApp.status !== "available"}
                >
                  <Play className="w-5 h-5" />
                  <span>
                    {currentHeroApp.status === "available"
                      ? "ENTER DISTRICT"
                      : "COMING SOON"}
                  </span>
                </button>
                <button
                  className="flex items-center space-x-3 bg-transparent border-2 border-white text-white px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 font-semibold tracking-wide"
                  onClick={() => setSelectedApp(currentHeroApp)}
                >
                  <Info className="w-5 h-5" />
                  <span>EXPLORE</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Navigation */}
        <div className="absolute bottom-8 left-8 flex space-x-3 z-10">
          {apps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 border-2 transition-all duration-300 ${
                index === heroIndex
                  ? "bg-white border-white"
                  : "bg-transparent border-gray-500 hover:border-white"
              }`}
              onClick={() => setHeroIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* City Districts */}
      <div className="relative z-10 -mt-20 pb-20">
        <div className="relative bg-gradient-to-b from-transparent to-black pt-20">
          {/* <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)`,
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div> */}

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-8 mb-16">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-4 tracking-tight">
                  CITY DISTRICTS
                </h2>
                <p className="text-gray-400 text-lg font-light tracking-wide">
                  Explore the shadowed realms of our gothic metropolis
                </p>
              </div>
            </div>

            {districts.map((district) => {
              const districtApps = apps.filter(
                (app) => app.district === district
              );
              if (districtApps.length === 0) return null;

              return (
                <div key={district} className="mb-16">
                  <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-bold tracking-wide">
                          {district}
                        </h3>
                        <div className="w-20 h-0.5 bg-white mt-2"></div>
                      </div>
                    </div>

                    <div className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
                      {districtApps.map((app) => (
                        <div
                          key={app.id}
                          className="flex-shrink-0 w-96 group cursor-pointer"
                          onClick={() => setSelectedApp(app)}
                        >
                          <div className="relative overflow-hidden border-2 border-gray-800 hover:border-gray-600 transition-all duration-500 group-hover:scale-105">
                            <div
                              className="w-full h-56 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                              style={{
                                backgroundImage: `url(${app.cardVideo})`,
                              }}
                            />
                            <div
                              className={`absolute inset-0 transition-all duration-300 ${
                                app.status === "available"
                                  ? "bg-black/60 group-hover:bg-black/40"
                                  : "bg-black/80"
                              }`}
                            ></div>

                            {app.status !== "available" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <Zap className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                                  <span className="text-gray-500 text-sm uppercase tracking-widest">
                                    Coming Soon
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                              <div className="flex items-center space-x-3 mb-3">
                                <app.icon
                                  className={`w-7 h-7 ${
                                    app.status === "available"
                                      ? "text-white"
                                      : "text-gray-600"
                                  }`}
                                />
                                <span
                                  className={`text-xs uppercase tracking-widest font-light ${
                                    app.status === "available"
                                      ? "text-green-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {app.status === "available"
                                    ? "LIVE"
                                    : "UNDER CONSTRUCTION"}
                                </span>
                              </div>
                              <h4
                                className={`text-2xl font-bold mb-3 tracking-wide ${
                                  app.status === "available"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                {app.name}
                              </h4>
                              <p
                                className={`text-sm line-clamp-2 font-light leading-relaxed ${
                                  app.status === "available"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {app.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* District Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-8">
          <div className="bg-black border-2 border-gray-800 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div
                className="w-full h-80 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${selectedApp.heroVideo})` }}
              />
              <div className="absolute inset-0 bg-black/80"></div>
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 p-3 bg-black/80 hover:bg-black border border-gray-700 hover:border-white transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-gray-300" />
                  <span className="text-sm uppercase tracking-widest text-gray-300">
                    {selectedApp.district}
                  </span>
                </div>
                <h2 className="text-4xl font-bold tracking-wide">
                  {selectedApp.name}
                </h2>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start space-x-6 mb-8">
                <selectedApp.icon className="w-16 h-16 text-white flex-shrink-0 mt-2" />
                <div>
                  <p className="text-gray-300 text-lg leading-relaxed font-light">
                    {selectedApp.longDescription}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <button
                  className={`flex items-center space-x-3 px-8 py-4 font-semibold tracking-wide transition-all duration-300 ${
                    selectedApp.status === "available"
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    selectedApp.status === "available" &&
                    handleEnterDistrict(selectedApp)
                  }
                  disabled={selectedApp.status !== "available"}
                >
                  <Play className="w-5 h-5" />
                  <span>
                    {selectedApp.status === "available"
                      ? "ENTER DISTRICT"
                      : "COMING SOON"}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-8 py-4 border-2 border-gray-700 text-white hover:bg-gray-900 hover:border-white transition-all duration-300 font-semibold tracking-wide"
                >
                  RETURN TO CITY
                </button>
              </div>

              <div className="pt-8 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div>
                    <h5 className="text-gray-400 uppercase tracking-widest mb-3 font-light">
                      STATUS
                    </h5>
                    <span
                      className={`px-4 py-2 border text-xs uppercase tracking-wider ${
                        selectedApp.status === "available"
                          ? "border-green-700 text-green-400 bg-green-900/20"
                          : "border-gray-700 text-gray-500 bg-gray-900/20"
                      }`}
                    >
                      {selectedApp.status === "available"
                        ? "LIVE"
                        : "UNDER CONSTRUCTION"}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-gray-400 uppercase tracking-widest mb-3 font-light">
                      DISTRICT
                    </h5>
                    <span className="text-white font-light">
                      {selectedApp.district}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-gray-400 uppercase tracking-widest mb-3 font-light">
                      TYPE
                    </h5>
                    <span className="text-white font-light">
                      Digital Infrastructure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-gray-600 text-lg font-light tracking-widest">
                ARKHAM ARCHIVES
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuickLaunch;
