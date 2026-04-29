import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useState, useMemo } from 'react'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
)

type Range = 'year' | 'month' | 'week'

const Earning = () => {
    const [range, setRange] = useState<Range>('year')
    const [index, setIndex] = useState(0)

    // 🔹 mock datasets
    const datasets = {
        year: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            data: [2000,3200,1500,2800,3500,4200,3900,5000,2100,1800,1600,3000]
        },
        month: {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500))
        },
        week: {
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            data: [120, 300, 250, 400, 350, 200, 150]
        }
    }

    const current = datasets[range]

    // 🔹 slice data based on slider
    const visibleData = useMemo(() => {
        if (range === 'year') return current

        const windowSize = range === 'month' ? 7 : 7
        return {
            labels: current.labels.slice(index, index + windowSize),
            data: current.data.slice(index, index + windowSize)
        }
    }, [range, index])

    const chartData = {
        labels: visibleData.labels,
        datasets: [
            {
                data: visibleData.data,
                fill: true,
                tension: 0.4,
                borderColor: 'hsl(var(--p))',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                pointRadius: 0
            }
        ]
    }

    const options = {
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' } }
        }
    }

    return (
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg w-full">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Earning reports</h2>

                <div className="flex gap-2">
                    <button
                        className={`btn btn-xs ${range === 'year' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setRange('year'); setIndex(0) }}
                    >
                        Year
                    </button>
                    <button
                        className={`btn btn-xs ${range === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setRange('month'); setIndex(0) }}
                    >
                        Month
                    </button>
                    <button
                        className={`btn btn-xs ${range === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setRange('week'); setIndex(0) }}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="mb-4">
                <p className="text-sm text-gray-500">Income</p>
                <p className="text-3xl font-bold">
                    ${visibleData.data.reduce((a, b) => a + b, 0).toLocaleString()}
                </p>
            </div>

            {/* CHART */}
            <div className="h-64">
                <Line data={chartData} options={options} />
            </div>

            {/* SLIDER (only for month/week) */}
            {range !== 'year' && (
                <input
                    type="range"
                    min={0}
                    max={current.data.length - 7}
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    className="range range-primary mt-4"
                />
            )}
        </div>
    )
}

export default Earning