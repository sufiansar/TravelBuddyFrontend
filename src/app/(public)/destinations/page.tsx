import Link from "next/link";

export default function DestinationsPage() {
  const destinations = [
    { name: "Thailand", travelers: 1250, image: "🇹🇭" },
    { name: "Japan", travelers: 980, image: "🇯🇵" },
    { name: "Italy", travelers: 850, image: "🇮🇹" },
    { name: "France", travelers: 920, image: "🇫🇷" },
    { name: "Spain", travelers: 750, image: "🇪🇸" },
    { name: "Australia", travelers: 680, image: "🇦🇺" },
    { name: "Canada", travelers: 620, image: "🇨🇦" },
    { name: "New Zealand", travelers: 540, image: "🇳🇿" },
    { name: "Germany", travelers: 710, image: "🇩🇪" },
    { name: "Netherlands", traveling: 650, image: "🇳🇱" },
    { name: "Greece", travelers: 580, image: "🇬🇷" },
    { name: "Portugal", travelers: 520, image: "🇵🇹" },
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          Popular Destinations
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Find travelers heading to these amazing destinations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Link
              key={destination.name}
              href={`/explore?destination=${destination.name}`}
            >
              <div className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer p-6 text-center border border-border">
                <div className="text-6xl mb-4">{destination.image}</div>
                <h2 className="text-xl font-bold mb-2 text-foreground">
                  {destination.name}
                </h2>
                <p className="text-muted-foreground">
                  {destination.travelers || 0} travelers
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
