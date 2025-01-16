"use client"

import * as React from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { Globe, Moon, Sun, Menu, Search, Bell, BarChart2, Activity, Brain, Zap, LineChart, PieChart } from 'lucide-react'

interface LivePreviewProps {
  title?: string
  className?: string
}

export function LivePreview({
  title = "Live Preview",
  className
}: LivePreviewProps) {
  const [isDark, setIsDark] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [activeChart, setActiveChart] = React.useState(0)

  // Simulate real-time data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveChart((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      "bg-background/50 backdrop-blur-xl",
      "border border-border/50",
      "shadow-glow-subtle",
      className
    )}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              "hover:bg-primary/10",
              isDark ? "text-yellow-500" : "text-blue-500"
            )}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className={cn(
        "relative",
        isDark ? "bg-zinc-900" : "bg-white",
        "transition-colors duration-300"
      )}>
        {/* App Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isDark ? "border-zinc-800" : "border-gray-100"
        )}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"
              )}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={cn(
              "text-lg font-semibold flex items-center gap-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <Brain className="w-5 h-5 text-primary" />
              AI Analytics
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={cn(
              "p-2 rounded-lg transition-colors",
              isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"
            )}>
              <Search className="w-5 h-5" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-colors",
              isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"
            )}>
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side Menu */}
        <div className={cn(
          "absolute top-[61px] left-0 bottom-0 w-64 z-10",
          "transform transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
          isDark ? "bg-zinc-900 border-r border-zinc-800" : "bg-white border-r border-gray-100"
        )}>
          <div className="p-4">
            <div className={cn(
              "text-sm font-medium mb-2",
              isDark ? "text-zinc-400" : "text-gray-500"
            )}>
              Analytics
            </div>
            {[
              { name: "Overview", icon: BarChart2 },
              { name: "Performance", icon: Activity },
              { name: "ML Models", icon: Brain },
              { name: "Real-time", icon: Zap }
            ].map((item) => (
              <button
                key={item.name}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-left mb-1",
                  "transition-colors flex items-center gap-2",
                  isDark ? (
                    "hover:bg-zinc-800 text-zinc-100"
                  ) : (
                    "hover:bg-gray-100 text-gray-900"
                  )
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "grid grid-cols-3 gap-4 p-4 min-h-[200px]",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {[LineChart, BarChart2, PieChart].map((Chart, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg p-4",
                "flex flex-col gap-2",
                "transform transition-all duration-500",
                isDark ? "bg-zinc-800" : "bg-gray-100",
                activeChart === i && "scale-[1.02] shadow-lg",
                activeChart !== i && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {i === 0 ? "Model Performance" : i === 1 ? "API Usage" : "Cost Distribution"}
                </span>
                <Activity className={cn(
                  "w-4 h-4",
                  activeChart === i && "animate-pulse text-primary"
                )} />
              </div>
              <div className={cn(
                "flex-1 flex items-center justify-center",
                "relative overflow-hidden"
              )}>
                <Chart className={cn(
                  "w-full h-24",
                  "transform transition-transform duration-500",
                  activeChart === i && "scale-110"
                )} />
                <div className={cn(
                  "absolute inset-0",
                  "bg-gradient-to-t from-primary/10 to-transparent",
                  "opacity-0 transition-opacity duration-500",
                  activeChart === i && "opacity-100"
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 