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
import { useState } from 'react'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
)

type Range = 'year' | 'month' | 'week'

const verticalLinePlugin = {
    id: 'verticalLine',
    afterDraw: (chart: any) => {
        const { ctx, tooltip } = chart

        if (!tooltip || !tooltip._active || tooltip._active.length === 0) return

        const activePoint = tooltip._active[0]
        const x = activePoint.element.x
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#5654E8'
        ctx.stroke()
        ctx.restore()
    }
}

const Earning = () => {
    const [range, setRange] = useState<Range>('year')

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

    const chartData = {
        labels: current.labels,
        datasets: [
            {
                data: current.data,
                fill: true,
                tension: 0.4,
                borderColor: '#5654E8',
                backgroundColor: 'rgba(86, 84, 232, 0.15)',
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#5654E8'
            }
        ]
    }

    const options: any = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
                external: (context: any) => {
                    const { chart, tooltip } = context

                    let tooltipEl = document.getElementById('chart-tooltip')

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div')
                        tooltipEl.id = 'chart-tooltip'
                        tooltipEl.style.position = 'absolute'
                        tooltipEl.style.pointerEvents = 'none'
                        tooltipEl.style.background = '#111'
                        tooltipEl.style.color = '#fff'
                        tooltipEl.style.padding = '8px 12px'
                        tooltipEl.style.borderRadius = '10px'
                        tooltipEl.style.fontSize = '12px'
                        tooltipEl.style.transition = 'all .1s ease'
                        tooltipEl.style.whiteSpace = 'nowrap'
                        document.body.appendChild(tooltipEl)
                    }

                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = '0'
                        return
                    }

                    const dataPoint = tooltip.dataPoints[0]

                    const value = dataPoint.raw
                    const label = dataPoint.label

                    tooltipEl.innerHTML = `
                        <div style="font-weight:600">${label}</div>
                        <div>$${value.toLocaleString()}</div>
                    `

                    const rect = chart.canvas.getBoundingClientRect()

                    tooltipEl.style.opacity = '1'
                    tooltipEl.style.left = rect.left + window.pageXOffset + dataPoint.element.x + 'px'
                    tooltipEl.style.top = rect.top + window.pageYOffset + dataPoint.element.y - 40 + 'px'
                }
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    }

    return (
        <div className="bg-base-200 border border-base-300 p-7 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Earning reports</h2>
                <div className="flex gap-2">
                    <button
                        className={`btn btn-xs ${range === 'year' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setRange('year')}
                    >
                        Year
                    </button>
                    <button
                        className={`btn btn-xs ${range === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setRange('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`btn btn-xs ${range === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setRange('week')}
                    >
                        Week
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-500">Income</p>
                <p className="text-3xl font-bold">
                    ${current.data.reduce((a, b) => a + b, 0).toLocaleString()}
                </p>
            </div>
            <div className="h-64 relative">
                <Line
                    data={chartData}
                    options={options}
                    plugins={[verticalLinePlugin]}
                />
            </div>
        </div>
    )
}

export default Earning