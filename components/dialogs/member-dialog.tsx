"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemberForm } from "@/components/forms/member-form"
import type { Member } from "@/lib/types"
import type { MemberFormData } from "@/lib/validations/member"

interface MemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member
  onSubmit: (data: MemberFormData) => Promise<void>
}

export function MemberDialog({ open, onOpenChange, member, onSubmit }: MemberDialogProps) {
  const handleSubmit = async (data: MemberFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "编辑会员" : "新增会员"}</DialogTitle>
        </DialogHeader>
        <MemberForm member={member} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
