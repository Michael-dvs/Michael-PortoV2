import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { useState } from "react";

interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: {
    name: string;
    avatar: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  className?: string;
  onActionClick?: () => void;
  actionText?: string;
}

const defaultPost = {
  title: "The Future of UI Design",
  excerpt:
    "Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.",
  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  author: {
    name: "Michael Aristyo",
    avatar: "https://github.com/shadcn.png",
  },
  date: "May 30, 2026",
  readTime: "5 min read",
  tags: ["Design", "UI/UX"],
};

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  author = defaultPost.author,
  date = defaultPost.date,
  readTime = defaultPost.readTime,
  tags = defaultPost.tags,
  className,
  onActionClick,
  actionText = "Read Article"
}: GlassBlogCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[400px]", className)}
    >
      <Card className="group relative h-full overflow-hidden rounded-2xl border-border/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md transition-all duration-300 hover:border-[#0066cc]/50 hover:shadow-xl hover:shadow-[#0066cc]/10">
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-900">
          {/* Skeleton Screen */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-850 opacity-20 animate-ping" />
            </div>
          )}

          <motion.img
            src={image}
            alt={title}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
            {tags?.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/80 dark:bg-zinc-950/85 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-950"
              >
                {tag}
              </Badge>
            ))}
            {tags && tags.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-white/80 dark:bg-zinc-950/85 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-950 font-mono"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Hover Overlay Action */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onActionClick}
              className="flex items-center gap-2 rounded-full bg-[#0066cc] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#0066cc]/25 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              {actionText}
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4 p-5">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-[#0066cc]">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-gray-500 dark:text-zinc-400">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-250">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <span className="font-medium text-foreground">
                  {author.name}
                </span>
                <span className="text-gray-400 dark:text-zinc-500">{date}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
