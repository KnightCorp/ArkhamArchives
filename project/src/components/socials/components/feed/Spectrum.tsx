import React, { useState, useEffect } from "react";
import {
  Newspaper,
  ArrowLeft,
  ArrowRight,
  Filter,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  bias: "left" | "center" | "right";
  summary: string;
  image: string;
  perspectives: string[];
  url?: string;
  publishedAt?: string;
}

interface SpectrumProps {
  currentUser: any;
}

// Function to analyze political bias using Spectrum API
const analyzeHeadlineWithAPI = async (headline: string): Promise<string> => {
  try {
    const response = await fetch(
      "https://spectrum-api-343916782787.us-central1.run.app/predict_political",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Spectrum API Response:", result);

    // Map API response to our bias categories
    const politicalLeaning =
      result.political_leaning?.toLowerCase() || "center";
    if (politicalLeaning.includes("left")) return "left";
    if (politicalLeaning.includes("right")) return "right";
    return "center";
  } catch (error) {
    console.error("Error calling Spectrum API:", error);
    return "center"; // Default fallback
  }
};

// Function to fetch news from World News API
const fetchWorldNews = async (): Promise<any[]> => {
  const apiKey = import.meta.env.VITE_WORLD_API_KEY;

  if (!apiKey) {
    throw new Error(
      "World News API key not found. Please set VITE_WORLD_API_KEY in your environment variables."
    );
  }

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const url = `https://api.worldnewsapi.com/top-news?source-country=us&language=en&date=${today}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  // Flatten the nested news structure
  const allNews = [];
  if (data.top_news && Array.isArray(data.top_news)) {
    for (const newsGroup of data.top_news) {
      if (newsGroup.news && Array.isArray(newsGroup.news)) {
        allNews.push(...newsGroup.news);
      }
    }
  }

  return allNews;
};

// Function to generate perspectives based on article content
const generatePerspectives = (
  title: string,
  summary: string,
  bias: string
): string[] => {
  // This is a simplified perspective generator
  // In a real app, you might want to use AI or more sophisticated analysis
  const perspectives = [];

  if (bias === "left") {
    perspectives.push(
      "Progressive viewpoint emphasizing social justice and equity"
    );
    perspectives.push(
      "Focus on government intervention and regulatory solutions"
    );
    perspectives.push(
      "Consideration of environmental and minority group impacts"
    );
  } else if (bias === "right") {
    perspectives.push(
      "Conservative approach emphasizing traditional values and limited government"
    );
    perspectives.push("Free market solutions and individual responsibility");
    perspectives.push("Economic growth and business-friendly policies");
  } else {
    perspectives.push(
      "Balanced analysis considering multiple stakeholder perspectives"
    );
    perspectives.push("Evidence-based approach with bipartisan considerations");
    perspectives.push(
      "Focus on practical solutions and measured policy responses"
    );
  }

  return perspectives;
};

export const Spectrum: React.FC<SpectrumProps> = ({ currentUser }) => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [filter, setFilter] = useState<"all" | "left" | "center" | "right">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTestResults, setApiTestResults] = useState<any[]>([]);

  useEffect(() => {
    loadNewsArticles();
  }, []);

  const loadNewsArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching news from World News API...");
      const worldNewsData = await fetchWorldNews();

      if (!worldNewsData || worldNewsData.length === 0) {
        throw new Error("No news articles found");
      }

      console.log(`📰 Found ${worldNewsData.length} articles`);

      // Convert World News API data to our format and analyze bias
      const processedArticles: NewsArticle[] = [];
      const apiResults = [];

      // Process up to 10 articles to avoid hitting API limits
      const articlesToProcess = worldNewsData.slice(0, 10);

      for (const article of articlesToProcess) {
        try {
          // Analyze bias using Spectrum API
          const analyzedBias = await analyzeHeadlineWithAPI(article.title);

          apiResults.push({
            headline: article.title,
            apiBias: analyzedBias,
            timestamp: new Date().toISOString(),
          });

          // Generate perspectives based on bias
          const perspectives = generatePerspectives(
            article.title,
            article.summary || article.text || "",
            analyzedBias
          );

          const processedArticle: NewsArticle = {
            id: article.id.toString(),
            title: article.title,
            source: extractSourceFromUrl(article.url) || "Unknown Source",
            bias: analyzedBias as "left" | "center" | "right",
            summary:
              article.summary ||
              article.text?.substring(0, 200) + "..." ||
              "No summary available",
            image:
              article.image ||
              "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop", // Fallback image
            perspectives: perspectives,
            url: article.url,
            publishedAt: article.publish_date,
          };

          processedArticles.push(processedArticle);
        } catch (error) {
          console.error(`Failed to process article "${article.title}":`, error);
          apiResults.push({
            headline: article.title,
            apiBias: "error",
            error: error,
            timestamp: new Date().toISOString(),
          });
        }
      }

      setApiTestResults(apiResults);
      console.log("✅ Spectrum API Test Results:", apiResults);

      if (processedArticles.length === 0) {
        throw new Error("Failed to process any articles");
      }

      setNewsArticles(processedArticles);
    } catch (err) {
      console.error("Error loading news articles:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load news articles"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract source name from URL
  const extractSourceFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", "").split(".")[0];
    } catch {
      return "Unknown Source";
    }
  };

  const filteredArticles =
    filter === "all"
      ? newsArticles
      : newsArticles.filter((article) => article.bias === filter);

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "less than an hour ago";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 text-white/60">
        Please log in to view news spectrum.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">
          Loading and analyzing news articles...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadNewsArticles}
          className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-xl rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <span className="text-white">View Perspective</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              All ({newsArticles.length})
            </button>
            <button
              onClick={() => setFilter("left")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                filter === "left"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                Left ({newsArticles.filter((a) => a.bias === "left").length})
              </span>
            </button>
            <button
              onClick={() => setFilter("center")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                filter === "center"
                  ? "bg-gray-500/20 text-gray-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>
                Center ({newsArticles.filter((a) => a.bias === "center").length}
                )
              </span>
            </button>
            <button
              onClick={() => setFilter("right")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                filter === "right"
                  ? "bg-red-500/20 text-red-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>
                Right ({newsArticles.filter((a) => a.bias === "right").length})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p>No articles found for the selected perspective.</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-black/40 backdrop-blur-xl rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback to a default image if the article image fails to load
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop";
                }}
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">{article.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span className="capitalize">{article.source}</span>
                      {article.publishedAt && (
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          article.bias === "left"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : article.bias === "right"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}
                      >
                        {article.bias === "left"
                          ? "Progressive"
                          : article.bias === "right"
                          ? "Conservative"
                          : "Neutral"}
                      </span>
                      <div className="text-xs text-white/40">AI-Analyzed</div>
                    </div>
                    {article.url && (
                      <button
                        onClick={() => window.open(article.url, "_blank")}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white/60" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-white/80 mb-4 leading-relaxed">
                  {article.summary}
                </p>

                <div className="space-y-2">
                  <h4 className="text-white/60 font-medium">
                    Key Perspectives
                  </h4>
                  <div className="space-y-1">
                    {article.perspectives.map((perspective, index) => (
                      <p
                        key={index}
                        className="text-white/80 text-sm flex items-start"
                      >
                        <span className="text-white/40 mr-2">•</span>
                        <span>{perspective}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadNewsArticles}
          className="px-6 py-3 bg-black/40 backdrop-blur-xl rounded-lg border border-white/10 text-white hover:bg-black/60 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Refreshing...</span>
            </div>
          ) : (
            "Refresh Articles"
          )}
        </button>
      </div>
    </div>
  );
};
