'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Badge } from '@/components/shared/Badge'

interface MembershipRule {
  id: string
  name: string
  min_points: number
  max_points: number | null
  multiplier: number
  color: string
  benefits: string[]
}

interface MembershipConfigProps {
  onConfigChange?: (rules: MembershipRule[]) => void
}

export function MembershipConfig({ onConfigChange }: MembershipConfigProps) {
  const [rules, setRules] = useState<MembershipRule[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMembershipRules()
  }, [])

  const fetchMembershipRules = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/membership')
      const data = await response.json()

      if (data.success) {
        setRules(data.data.rules)
      } else {
        console.error('Failed to fetch membership rules:', data.error)
      }
    } catch (error) {
      console.error('Error fetching membership rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRuleChange = (index: number, field: keyof MembershipRule, value: any) => {
    const updatedRules = [...rules]
    updatedRules[index] = { ...updatedRules[index], [field]: value }
    setRules(updatedRules)
  }

  const handleBenefitChange = (ruleIndex: number, benefitIndex: number, value: string) => {
    const updatedRules = [...rules]
    updatedRules[ruleIndex].benefits[benefitIndex] = value
    setRules(updatedRules)
  }

  const addBenefit = (ruleIndex: number) => {
    const updatedRules = [...rules]
    updatedRules[ruleIndex].benefits.push('New benefit')
    setRules(updatedRules)
  }

  const removeBenefit = (ruleIndex: number, benefitIndex: number) => {
    const updatedRules = [...rules]
    updatedRules[ruleIndex].benefits.splice(benefitIndex, 1)
    setRules(updatedRules)
  }

  const handleSaveCard = async (index: number) => {
    try {
      setSaving(true)
      const rule = rules[index]

      // Validate rule
      if (rule.multiplier < 0.1 || rule.multiplier > 5.0) {
        alert(`Invalid multiplier for ${rule.name}: must be between 0.1 and 5.0`)
        return
      }
      if (rule.min_points < 0) {
        alert(`Invalid minimum points for ${rule.name}: must be non-negative`)
        return
      }

      const response = await fetch('/api/admin/membership', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`${rule.name} level updated successfully!`)
        setEditingCard(null)
        onConfigChange?.(rules)
      } else {
        alert(`Failed to update ${rule.name}: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving membership rule:', error)
      alert('Failed to update membership rule. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingCard(null)
    fetchMembershipRules() // Reset to original values
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Membership Configuration</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--surface-light)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full bg-white/20"></div>
                <div className="h-5 bg-white/20 rounded w-24"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-white/20 rounded w-32"></div>
                <div className="h-4 bg-white/20 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Membership Configuration</h2>

      <div className="flex flex-col gap-4">
        {rules.map((rule, index) => (
          <Card
            key={rule.id}
            className={`border-[var(--border)] ${
              editingCard === index ? 'ring-2 ring-[var(--accent)]' : ''
            }`}
            style={{ borderLeftColor: rule.color, borderLeftWidth: editingCard === index ? '4px' : '3px' }}
          >
            <div className="p-4">
              {editingCard === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: rule.color }}
                      ></div>
                      <Input
                        value={rule.name}
                        onChange={(e) => handleRuleChange(index, 'name', e.target.value)}
                        className="font-semibold"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCard(null)}
                      className="text-[var(--text-muted)] p-1"
                    >
                      <span className="material-icons">close</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">Min Points</label>
                      <Input
                        type="number"
                        value={rule.min_points}
                        onChange={(e) => handleRuleChange(index, 'min_points', parseInt(e.target.value) || 0)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">Max Points</label>
                      <Input
                        type="text"
                        value={rule.max_points === null ? '∞' : rule.max_points}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '∞') {
                            handleRuleChange(index, 'max_points', null)
                          } else {
                            handleRuleChange(index, 'max_points', parseInt(value) || null)
                          }
                        }}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">Multiplier</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="5.0"
                        value={rule.multiplier}
                        onChange={(e) => handleRuleChange(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={rule.color}
                          onChange={(e) => handleRuleChange(index, 'color', e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={rule.color}
                          onChange={(e) => handleRuleChange(index, 'color', e.target.value)}
                          size="sm"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-2">Benefits</label>
                    <div className="space-y-2">
                      {rule.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <span className="material-icons text-[var(--accent)] text-sm">check_circle</span>
                          <Input
                            value={benefit}
                            onChange={(e) => handleBenefitChange(index, benefitIndex, e.target.value)}
                            size="sm"
                            className="flex-1"
                          />
                          {rule.benefits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBenefit(index, benefitIndex)}
                              className="text-[var(--error)] hover:text-[var(--error-dark)] p-1"
                            >
                              <span className="material-icons text-sm">remove_circle</span>
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addBenefit(index)}
                        className="w-full"
                      >
                        <span className="material-icons mr-2 text-sm">add</span>
                        Add Benefit
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleSaveCard(index)}
                      disabled={saving}
                      className="flex-1"
                      size="sm"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="material-icons mr-2 text-sm">save</span>
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Preview Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: rule.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[var(--text-primary)] truncate">{rule.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--text-muted)]">
                          {rule.min_points.toLocaleString()} - {rule.max_points === null ? '∞' : rule.max_points.toLocaleString()} pts
                        </span>
                        <Badge variant="secondary" size="sm">{rule.multiplier}x</Badge>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {rule.benefits.length} benefits
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCard(index)}
                    className="flex-shrink-0"
                  >
                    <span className="material-icons mr-2 text-sm">edit</span>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}