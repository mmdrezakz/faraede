"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "فروردین", comments: 245, visits: 12500 },
  { month: "اردیبهشت", comments: 312, visits: 18400 },
  { month: "خرداد", comments: 278, visits: 16200 },
  { month: "تیر", comments: 421, visits: 21300 },
  { month: "مرداد", comments: 389, visits: 19800 },
  { month: "شهریور", comments: 456, visits: 24500 },
  { month: "مهر", comments: 502, visits: 28900 },
  { month: "آبان", comments: 478, visits: 26700 },
  { month: "آذر", comments: 534, visits: 31200 },
  { month: "دی", comments: 10000, visits: 35600 },
  { month: "بهمن", comments: 20000, visits: 33400 },
  { month: "اسفند", comments: 6000, visits: 40000 },
]

const chartConfig = {
  comments: {
    label: "کامنت‌ها",
    color: "#f97316", // نارنجی
  },
  visits: {
    label: "بازدیدها",
    color: "#3b82f6", // آبی
  },
}

export function TotalComments() {
  // فرمت کردن اعداد به فارسی
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num)
  }

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} stroke="#374151" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={6}
            axisLine={false}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickFormatter={(value)=> value.slice(0,3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#9CA3AF"
            tick={{ fill: '#000000', fontSize: 10 }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent className={"bg-yellow-600"}
                formatter={(value, name) => {
                  const formattedValue = formatNumber(Number(value))
                  const label = name === 'comments' ? 'کامنت‌ها' : 'بازدیدها'
                  return [formattedValue, label]
                }}
              />
            } 
          />
          <Bar 
            dataKey="comments" 
            fill="var(--color-comments)" 
            radius={[4, 4, 0, 0]} 
            name="کامنت‌ها"
          />
          <Bar 
            dataKey="visits" 
            fill="var(--color-visits)" 
            radius={[4, 4, 0, 0]} 
            name="بازدیدها"
          />
        </BarChart>
      </ChartContainer>

      {/* راهنمای رنگ‌ها */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="rounded w-4 h-4" style={{ backgroundColor: '#f97316' }} />
          <span className="text-gray-300 text-sm">کامنت‌ها</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded w-4 h-4" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-gray-300 text-sm">بازدیدها</span>
        </div>
      </div>
    </div>
  )
}