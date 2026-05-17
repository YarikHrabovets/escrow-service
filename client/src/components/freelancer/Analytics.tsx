import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const Analytics = () => {
    const data = {
        datasets: [
            {
                data: [90, 10],
                backgroundColor: [
                    '#5654E8',
                    '#1f2937'
                ],
                borderWidth: 0
            }
        ]
    }

    const options = {
        cutout: '75%',
        plugins: {
            legend: { display: false }
        }
    }

    return (
        <div className="bg-zinc-900 border border-zinc-700 p-7 rounded-xl shadow-sm w-full max-w-md flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold mb-4">Analytics</h2>
                <div className="relative w-40 h-40 mx-auto">
                    <Doughnut data={data} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold">90%</p>
                        <p className="text-sm text-gray-500">Performance</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center">
                    <p className="text-lg font-semibold">90%</p>
                    <p className="text-xs text-gray-500">Response rate</p>
                </div>
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center">
                    <p className="text-lg font-semibold">1,298</p>
                    <p className="text-xs text-gray-500">Order completion</p>
                </div>
            </div>
        </div>
    )
}

export default Analytics