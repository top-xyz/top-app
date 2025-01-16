"use client"

import * as React from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { 
  Brain, Activity, BarChart2, LineChart, PieChart, 
  Settings, Bell, Search, Menu as MenuIcon, Bot,
  Zap, Database, Sparkles, ArrowUp, ArrowDown
} from 'lucide-react'

interface AnalyticsPreviewProps {
  title?: string
  className?: string
}

export function AnalyticsPreview({
  title = "AI Analytics Dashboard",
  className
}: AnalyticsPreviewProps) {
  const [activeChart, setActiveChart] = React.useState(0)
  const [isDark, setIsDark] = React.useState(true)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

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
          <Brain className="w-4 h-4 text-primary animate-pulse" />
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
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
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
              <MenuIcon className="w-5 h-5" />
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
        <div className="p-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { title: "Active Models", value: "12", icon: Brain, change: "+2", up: true },
              { title: "Inference/s", value: "1.2k", icon: Zap, change: "+15%", up: true },
              { title: "Data Points", value: "850k", icon: Database, change: "+12k", up: true },
              { title: "Accuracy", value: "98.5%", icon: Sparkles, change: "-0.2%", up: false }
            ].map((stat) => (
              <div
                key={stat.title}
                className={cn(
                  "p-4 rounded-lg",
                  isDark ? "bg-zinc-800" : "bg-gray-100",
                  "transform transition-all duration-500"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    stat.up ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.change}
                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  </div>
                </div>
                <div className={cn(
                  "text-2xl font-semibold mb-1",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {stat.value}
                </div>
                <div className={cn(
                  "text-sm",
                  isDark ? "text-zinc-400" : "text-gray-500"
                )}>
                  {stat.title}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[LineChart, BarChart2, PieChart].map((Chart, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg p-4",
                  "transform transition-all duration-500",
                  isDark ? "bg-zinc-800" : "bg-gray-100",
                  activeChart === i && "scale-[1.02] shadow-lg",
                  isDark ? (
                    activeChart === i ? "shadow-primary/20" : ""
                  ) : (
                    activeChart === i ? "shadow-primary/10" : ""
                  )
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "text-sm font-medium",
                    isDark ? "text-zinc-100" : "text-gray-900"
                  )}>
                    {["Model Performance", "Request Volume", "Resource Usage"][i]}
                  </div>
                  <Chart className={cn(
                    "w-5 h-5",
                    activeChart === i ? "text-primary" : isDark ? "text-zinc-500" : "text-gray-400"
                  )} />
                </div>
                <div className={cn(
                  "h-32 flex items-end justify-between gap-1",
                  "transform transition-opacity duration-500",
                  activeChart === i ? "opacity-100" : "opacity-50"
                )}>
                  {[...Array(12)].map((_, j) => (
                    <div
                      key={j}
                      className={cn(
                        "w-full bg-primary/20 rounded-sm",
                        activeChart === i && "animate-pulse"
                      )}
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${j * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ML Insights */}
          <div className={cn(
            "p-4 rounded-lg",
            isDark ? "bg-zinc-800" : "bg-gray-100"
          )}>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-primary" />
              <div className={cn(
                "text-sm font-medium",
                isDark ? "text-zinc-100" : "text-gray-900"
              )}>
                ML Insights
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Model performance improved by 12% after latest training",
                "Detected anomaly in request patterns at 14:30 UTC",
                "Resource optimization saved 25% in compute costs"
              ].map((insight, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-md text-sm",
                    isDark ? "bg-zinc-900" : "bg-white",
                    isDark ? "text-zinc-300" : "text-gray-700"
                  )}
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 