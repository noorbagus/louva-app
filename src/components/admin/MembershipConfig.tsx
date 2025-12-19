'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

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
  const [editing, setEditing] = useState(false)
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

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate rules before saving
      for (const rule of rules) {
        if (rule.multiplier < 0.1 || rule.multiplier > 5.0) {
          alert(`Invalid multiplier for ${rule.name}: must be between 0.1 and 5.0`)
          return
        }
        if (rule.min_points < 0) {
          alert(`Invalid minimum points for ${rule.name}: must be non-negative`)
          return
        }
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
        alert('Membership rules updated successfully!')
        setEditing(false)
        onConfigChange?.(rules)
      } else {
        alert(`Failed to update membership rules: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving membership rules:', error)
      alert('Failed to update membership rules. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    fetchMembershipRules() // Reset to original values
  }

  if (loading) {
    return (
      <Card className="bg-[var(--surface-light)] border-[var(--border)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4 space-y-2">
                <div className="h-4 bg-white/20 rounded w-24"></div>
                <div className="h-3 bg-white/20 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-[var(--surface-light)] border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Membership Levels</h3>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            <span className="material-icons mr-2">edit</span>
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)]"
            style={{ borderLeftColor: rule.color, borderLeftWidth: '4px' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: rule.color }}
              ></div>
              {editing ? (
                <Input
                  value={rule.name}
                  onChange={(e) => handleRuleChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
              ) : (
                <h4 className="text-lg font-medium text-[var(--text-primary)]">
                  {rule.name}
                </h4>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-[var(--text-muted)] block mb-1">
                  Minimum Points
                </label>
                {editing ? (
                  <Input
                    type="number"
                    value={rule.min_points}
                    onChange={(e) => handleRuleChange(index, 'min_points', parseInt(e.target.value) || 0)}
                  />
                ) : (
                  <div className="text-[var(--text-primary)]">{rule.min_points.toLocaleString()}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-[var(--text-muted)] block mb-1">
                  Maximum Points
                </label>
                {editing ? (
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
                  />
                ) : (
                  <div className="text-[var(--text-primary)]">
                    {rule.max_points === null ? '∞' : rule.max_points.toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-[var(--text-muted)] block mb-1">
                  Points Multiplier
                </label>
                {editing ? (
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={rule.multiplier}
                    onChange={(e) => handleRuleChange(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                  />
                ) : (
                  <div className="text-[var(--text-primary)]">{rule.multiplier}x</div>
                )}
              </div>

              <div>
                <label className="text-sm text-[var(--text-muted)] block mb-1">
                  Level Color
                </label>
                {editing ? (
                  <Input
                    type="color"
                    value={rule.color}
                    onChange={(e) => handleRuleChange(index, 'color', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-[var(--border)]"
                      style={{ backgroundColor: rule.color }}
                    ></div>
                    <span className="text-[var(--text-primary)] text-sm">{rule.color}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--text-muted)] block mb-2">
                Benefits
              </label>
              <div className="space-y-2">
                {rule.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-2">
                    <span className="material-icons text-[var(--accent)] text-sm">check_circle</span>
                    {editing ? (
                      <Input
                        value={benefit}
                        onChange={(e) => handleBenefitChange(index, benefitIndex, e.target.value)}
                        className="flex-1"
                      />
                    ) : (
                      <span className="text-[var(--text-primary)] text-sm">{benefit}</span>
                    )}
                    {editing && rule.benefits.length > 1 && (
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
                {editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addBenefit(index)}
                    className="w-full"
                  >
                    <span className="material-icons mr-2">add</span>
                    Add Benefit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-icons mr-2">save</span>
                Save Changes
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  )
}