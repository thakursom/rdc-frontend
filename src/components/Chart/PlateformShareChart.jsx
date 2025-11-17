import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function PlateformShareChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // cleanup
        }

        const ctx = chartRef.current.getContext("2d");

        const Utils = {
            rand(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            numbers(cfg) {
                const nums = [];
                for (let i = 0; i < cfg.count; i++) {
                    nums.push(this.rand(cfg.min, cfg.max));
                }
                return nums;
            },
            CHART_COLORS: {
                green: '#14CDBB',
                purple: '#9550DF',
                orange: '#F88C65',
                yellow: '#FFB748',
                blue: '#656FF7'
            }
        };

        const DATA_COUNT = 5;
        const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

        const data = {
            labels: ['green', 'purple', 'orange', 'yellow', 'blue'],
            datasets: [
                {
                    label: "Dataset 1",
                    data: Utils.numbers(NUMBER_CFG),
                    backgroundColor: Object.values(Utils.CHART_COLORS).slice(0, DATA_COUNT)
                }
            ]
        };

        const config = {
            type: "doughnut",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                cutout: "70%",
                plugins: {
                    legend: { position: "bottom" },
                    title: { display: false }
                }
            }
        };

        chartInstance.current = new Chart(ctx, config);

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, []);

    return (
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
