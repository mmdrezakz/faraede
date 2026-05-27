'use client'

import { useState } from 'react'


import { toPersianNumber } from "../../components/comments/utils"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../@/components/ui/chart"

export const description = "A simple area chart"

const chartData = [
  { month: "فروردین", desktop: 186 },
  { month: "اردیبهشت", desktop: 305 },
  { month: "خرداد", desktop: 237 },
  { month: "تیر", desktop: 73 },
  { month: "مرداد", desktop: 209 },
  { month: "شهریور", desktop: 209 },

  { month: "مهر", desktop: 214 },
  { month: "آبان", desktop: 214 },
  { month: "آذر", desktop: 214 },
  { month: "دی", desktop: 214 },
  { month: "بهمن", desktop: 214 },
  { month: "اسفند", desktop: 214 },


]


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-6)",
  },
} 


export default function UsersTable({ users, onToggleStatus }) {


  return (
    <main className='w-full'>

      <Card className="w-full">
      <CardHeader>
        <CardTitle>لیست کاربران</CardTitle>
        <CardDescription>
          تعداد کاربران سایت را در ماه های گذشته تا به الان مشاهده کنید 
        </CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            >
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              />
          </AreaChart>
        </ChartContainer>
      </CardContent>

    </Card>
              </main>
  )
}