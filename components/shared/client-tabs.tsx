'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface TabItem {
  value: string
  label: React.ReactNode
  content: React.ReactNode
}

interface ClientTabsProps {
  defaultValue: string
  tabs: TabItem[]
  variant?: 'default' | 'line'
  separator?: React.ReactNode
  className?: string
}

export function ClientTabs({ defaultValue, tabs, variant = 'line', separator, className }: ClientTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabsList variant={variant}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {separator}
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
