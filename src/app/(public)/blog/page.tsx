export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "10 Best Travel Buddy Stories of 2024",
      excerpt:
        "Read inspiring stories from travelers who found amazing companions...",
      date: "Dec 5, 2024",
      author: "Sarah J.",
      image: "✈️",
    },
    {
      id: 2,
      title: "How to Plan the Perfect Group Trip",
      excerpt:
        "A comprehensive guide to coordinating travel with new friends...",
      date: "Dec 1, 2024",
      author: "Mike T.",
      image: "🗺️",
    },
    {
      id: 3,
      title: "Budget Travel Tips for Group Adventures",
      excerpt: "Maximize your savings while traveling with a group...",
      date: "Nov 28, 2024",
      author: "Emma L.",
      image: "💰",
    },
    {
      id: 4,
      title: "Safety Tips When Meeting Travel Buddies",
      excerpt:
        "Important guidelines for staying safe while meeting new travelers...",
      date: "Nov 25, 2024",
      author: "Alex P.",
      image: "🛡️",
    },
    {
      id: 5,
      title: "Best Destinations for Solo Travelers",
      excerpt: "Top destinations that are perfect for solo adventurers...",
      date: "Nov 20, 2024",
      author: "Jordan K.",
      image: "🌍",
    },
    {
      id: 6,
      title: "Communication is Key: Travel Group Etiquette",
      excerpt: "Learn how to communicate effectively with your travel group...",
      date: "Nov 15, 2024",
      author: "Casey M.",
      image: "💬",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          Travel Blog
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Tips, stories, and advice for connecting with travel buddies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden cursor-pointer border border-border"
            >
              <div className="bg-muted h-40 flex items-center justify-center text-6xl">
                {post.image}
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {post.date} • By {post.author}
                </p>
                <h2 className="text-xl font-bold mb-2 text-foreground">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
