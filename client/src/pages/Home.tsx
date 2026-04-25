import Button from '../components/ui/Button.tsx'
import Card from '../components/ui/Card'

function Home() {
    const items = [
    {
      title: "🔒 Secure Payments",
      description: "Your funds are locked until the job is completed.",
    },
    {
      title: "⚖️ Dispute Protection",
      description: "Fair resolution system if something goes wrong.",
    },
    {
      title: "⚡ Fast & Simple",
      description: "Create deals in seconds with a clean UI.",
    },
    {
      title: "📊 Reputation System",
      description: "Build trust with ratings and completed deals.",
    },
  ]

    return (
        <div className="bg-base-100 text-base-content">
            <section className="hero min-h-[80vh] text-center bg-linear-to-b from-base-200 to-base-300">
                <div className="hero-content flex-col">
                    <h1 className="text-5xl font-bold max-w-2xl">
                        Trade Safely. Get Paid Securely.
                    </h1>
                    <p className="text-gray-400 max-w-xl">
                        Protect your freelance deals with a simple, fast, and secure escrow platform.
                        No scams. No stress.
                    </p>
                    <Button>Start a Deal</Button>
                </div>
            </section>
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-20">
                {items.map((item) => (
                    <Card
                        key={item.title}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </section>
            <section className="text-center py-24">
                <h2 className="text-3xl font-semibold mb-6">
                    Ready to stop getting scammed?
                </h2>
                <Button>Create Your First Deal</Button>
            </section>
        </div>
    )
}

export default Home
