// Development branch - AI Art Battle Arena
// This is the main app component for the AI Art Battle project
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Clock, Users, Globe, Trophy, Zap } from "lucide-react";
import artwork1 from "./assets/artwork_1_data_wars.png";
import artwork2 from "./assets/artwork_2_titans_clash.png";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

const ROUND_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const artworks = [
  {
    id: 1,
    title: "The Data Wars - AI vs Privacy",
    image: artwork1,
    description:
      "The Data Wars represents the defining conflict of our digital age - the struggle between AI advancement and human privacy. Inspired by the recent Reddit vs Anthropic lawsuit, this piece visualizes how our personal data has become the new oil, extracted and refined by AI corporations to fuel their technological empires. The towering digital fortress symbolizes the seemingly impenetrable power of these tech giants, while the human figures below represent all of us - users whose digital lives are harvested, analyzed, and monetized often without our full understanding or consent. The flickering scales of justice remind us that the legal frameworks governing this new reality are still being written, and the outcome will determine whether we live in a world where privacy is a luxury or a fundamental right. This artwork challenges viewers to consider: In our rush toward an AI-powered future, what are we willing to sacrifice, and who gets to decide?",
  },
  {
    id: 2,
    title: "The Fracture of Power - When Titans Clash",
    image: artwork2,
    description:
      "The Fracture of Power emerges from the recent public feud between two of the most influential figures of our time, representing a broader conflict between technological disruption and traditional authority. This piece visualizes the moment when the marriage of convenience between tech innovation and political power finally breaks down, revealing the fundamental tensions that have always existed beneath the surface. The two titans represent not just individuals, but entire ecosystems of power - one built on innovation, disruption, and digital influence, the other on tradition, regulation, and institutional authority. The fractured landscape between them shows how their conflict doesn't just affect them, but tears through the fabric of society itself, disrupting markets, breaking communication channels, and forcing everyone to choose sides. The falling stock charts and exploding social media notifications remind us that in our interconnected world, when titans clash, the shockwaves reach every corner of our digital and economic lives. This artwork asks: Can these two forms of power coexist, or are we witnessing the beginning of a new kind of civil war fought not with weapons, but with tweets, regulations, and market manipulation?",
  },
];

const countries = [
  "🇺🇸",
  "🇬🇧",
  "🇩🇪",
  "🇫🇷",
  "🇯🇵",
  "🇨🇦",
  "🇦🇺",
  "🇧🇷",
  "🇮🇳",
  "🇰🇷",
  "🇳🇱",
  "🇸🇪",
  "🇨🇭",
  "🇸🇬",
  "🇮🇱",
];

function App() {
  const [votes, setVotes] = useState({ 1: 0, 2: 0 });
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [roundNumber, setRoundNumber] = useState(1);
  const [recentVoters, setRecentVoters] = useState([]);
  const [isVoting, setIsVoting] = useState(false);

  // Simulate round timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          // Reset round
          setVotes({ 1: 0, 2: 0 });
          setUserVote(null);
          setRoundNumber((prev) => prev + 1);
          setRecentVoters([]);
          return ROUND_DURATION;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate random votes
  useEffect(() => {
    const voteSimulator = setInterval(() => {
      const artworkId = Math.random() > 0.5 ? 1 : 2;
      const country = countries[Math.floor(Math.random() * countries.length)];

      setVotes((prev) => ({
        ...prev,
        [artworkId]: prev[artworkId] + 1,
      }));

      setRecentVoters((prev) => [
        { country, artworkId, timestamp: Date.now() },
        ...prev.slice(0, 9),
      ]);
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(voteSimulator);
  }, []);

  const handleVote = async (artworkId) => {
    if (userVote || isVoting) return;

    setIsVoting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setVotes((prev) => ({
      ...prev,
      [artworkId]: prev[artworkId] + 1,
    }));

    setUserVote(artworkId);
    setIsVoting(false);

    // Add user vote to recent voters (assuming US for demo)
    setRecentVoters((prev) => [
      { country: "🇺🇸", artworkId, timestamp: Date.now() },
      ...prev.slice(0, 9),
    ]);
  };

  const totalVotes = votes[1] + votes[2];
  const artwork1Percentage =
    totalVotes > 0 ? (votes[1] / totalVotes) * 100 : 50;
  const artwork2Percentage =
    totalVotes > 0 ? (votes[2] / totalVotes) * 100 : 50;

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const winner = votes[1] > votes[2] ? 1 : votes[2] > votes[1] ? 2 : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                AI Art Battle Arena
              </h1>
              <h2 className="text-lg text-gray-300 mb-1">
                Real-Time AI Art Voting Competition
              </h2>
              <p className="text-gray-400">
                Vote for your favorite AI-generated artwork based on trending
                news topics
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-white mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                Round {roundNumber}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Battle Arena */}
      <main className="container mx-auto px-4 py-8">
        <section aria-label="AI Art Battle Arena">
          <h2 className="sr-only">Current Art Battle</h2>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {artworks.map((artwork) => (
              <motion.article
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: artwork.id * 0.1 }}
                aria-labelledby={`artwork-${artwork.id}-title`}
              >
                <Card
                  className={`relative overflow-hidden border-2 transition-all duration-300 ${
                    userVote === artwork.id
                      ? "border-green-500 shadow-green-500/20 shadow-xl"
                      : winner === artwork.id
                      ? "border-yellow-500 shadow-yellow-500/20 shadow-xl"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={artwork.image}
                        alt={`AI-generated artwork: ${artwork.title}`}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                      {winner === artwork.id && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 text-black">
                            <Trophy className="w-4 h-4 mr-1" />
                            Leading
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3
                        id={`artwork-${artwork.id}-title`}
                        className="text-xl font-bold text-white mb-3"
                      >
                        {artwork.title}
                      </h3>

                      <div
                        className="mb-4"
                        aria-label={`Voting statistics for ${artwork.title}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">
                            Votes: {votes[artwork.id]}
                          </span>
                          <span className="text-gray-300">
                            {artwork.id === 1
                              ? artwork1Percentage.toFixed(1)
                              : artwork2Percentage.toFixed(1)}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            artwork.id === 1
                              ? artwork1Percentage
                              : artwork2Percentage
                          }
                          className="h-2"
                          aria-label={`${artwork.title} vote percentage`}
                        />
                      </div>

                      <Button
                        onClick={() => handleVote(artwork.id)}
                        disabled={userVote !== null || isVoting}
                        className={`w-full mb-4 ${
                          userVote === artwork.id
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        aria-label={`Vote for ${artwork.title}`}
                      >
                        {isVoting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Voting...
                          </div>
                        ) : userVote === artwork.id ? (
                          "Voted!"
                        ) : userVote ? (
                          "Vote Cast"
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Vote for this artwork
                          </>
                        )}
                      </Button>

                      <details className="text-gray-300 text-sm">
                        <summary className="cursor-pointer hover:text-white transition-colors mb-2">
                          Read artist's statement
                        </summary>
                        <p className="leading-relaxed">{artwork.description}</p>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Live Stats */}
        <section aria-label="Live voting statistics and recent activity">
          <h2 className="sr-only">Live Statistics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-white/20 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Live Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Votes</span>
                    <span className="text-white font-semibold">
                      {totalVotes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Round Duration</span>
                    <span className="text-white font-semibold">1 Hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Round</span>
                    <span className="text-white font-semibold">
                      #{roundNumber}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Recent Voters
                  </h3>
                </div>
                <div
                  className="space-y-2"
                  role="log"
                  aria-live="polite"
                  aria-label="Recent voting activity"
                >
                  <AnimatePresence>
                    {recentVoters.map((voter, index) => (
                      <motion.div
                        key={`${voter.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xl"
                            role="img"
                            aria-label="Country flag"
                          >
                            {voter.country}
                          </span>
                          <span className="text-gray-300">voted for</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Artwork {voter.artworkId}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {recentVoters.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No votes yet this round
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400 text-sm">
            AI Art Battle Arena - Where creativity meets competition. Powered by
            artificial intelligence and human creativity.
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
