import { BookOpen, BookMarked, Video, Calculator } from "lucide-react";
import PracticeCard from "./PracticeCard";

const cards = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    title: "Practice Questions",
    description: "Algebra, grammar, passage comprehension.",
    href: "/my-tests",
    progress: 35,
  },
  {
    icon: <BookMarked className="w-4 h-4" />,
    title: "Vocabulary Cards",
    description: "SAT flashcards with spaced repetition.",
    href: "/my-tests",
    progress: 12,
  },
  {
    icon: <Video className="w-4 h-4" />,
    title: "English Lessons",
    description: "Reading & Writing strategy guides.",
    href: "#",
    progress: 0,
  },
  {
    icon: <Calculator className="w-4 h-4" />,
    title: "Math Lessons",
    description: "Algebra, geometry, data tutorials.",
    href: "#",
    progress: 0,
  },
];

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => (
        <PracticeCard key={card.title} {...card} />
      ))}
    </div>
  );
}
