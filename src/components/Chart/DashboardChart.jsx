import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function DashboardChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");

        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: '',
                    data: [1800, 2000, 2200, 2800, 4500, 5200],
                    backgroundColor: '#14CDBB',
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false,
                    barPercentage: 0.6 //60% width
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 6000, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });

        return () => chart.destroy(); // Cleanup on unmount
    }, []);

    return (
        <div className="main-chartbox">
            <canvas id="barChartDashboard" ref={chartRef}></canvas>
        </div>
    );
}
