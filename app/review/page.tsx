// app/page.tsx (server component by default)
import AIReviewSummary from "@/components/Ai/summary.reviews";

export default function Page() {
    const reviews = [
        { rating: 5, comment: "Perfect spot! Cold water and super easy to access during my morning runs." },
        { rating: 4, comment: "Good pressure, but the ground around it was a bit muddy after rain." },
        { rating: 2, comment: "Water tasted slightly metallic. Might need a filter change." },
        { rating: 5, comment: "Crystal clear water and well-maintained. Definitely my go-to bubbler." },
        { rating: 3, comment: "Works fine, but its often surrounded by litter. Needs more cleaning attention." },
        { rating: 4, comment: "Handy location near the park entrance. Sometimes a little warm in the afternoon." },
        { rating: 1, comment: "Barely any pressure. I had to bend awkwardly just to get a sip." },
        { rating: 5, comment: "Best bubbler around! Clean, cool, and refreshing every time." }
    ];

    return (
        <div className="p-8">
            <AIReviewSummary reviews={reviews} />
        </div>
    );
}
