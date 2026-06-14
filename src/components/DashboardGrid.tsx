import { BookOpen, BookMarked, Video, Calculator } from "lucide-react";
import PracticeCard from "./PracticeCard";

const cards = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Themed Practice Questions",
    description: "Practice by topic — algebra, grammar, passage comprehension, and more.",
    href: "/my-tests",
    progress: 35,
  },
  {
    icon: <BookMarked className="w-6 h-6" />,
    title: "Vocabulary Cards",
    description: "Build your SAT vocabulary with curated flashcards and spaced repetition.",
    href: "/my-tests",
    progress: 12,
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "English Section Lessons",
    description: "Watch strategy guides for Reading & Writing sections with expert tips.",
    href: "#",
    progress: 0,
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Math Section Lessons",
    description: "Step-by-step math tutorials covering algebra, geometry, and data analysis.",
    href: "#",
    progress: 0,
  },
];

export default function DashboardGrid() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {cards.map((card) => (
        <PracticeCard key={card.title} {...card} />
      ))}
    </div>
  );
}
