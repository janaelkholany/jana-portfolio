'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  FileText,
  X,
  Loader2,
  FileUp,
  Calendar,
  BookOpen,
  Paperclip,
  Lock,
  LogOut,
  Eye,
  Files,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  useAssignments,
  type Assignment,
  type AssignmentInput,
  type AssignmentFile,
} from '@/hooks/use-assignments'
import { useAdmin } from '@/hooks/use-admin'

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getFileIconColor(fileName: string | null): string {
  if (!fileName) return ''
  const lower = fileName.toLowerCase()
  if (lower.match(/\.(pdf)$/)) return 'text-rose-600'
  if (lower.match(/\.(docx?|rtf)$/)) return 'text-sky-600'
  if (lower.match(/\.(pptx?)$/)) return 'text-orange-600'
  if (lower.match(/\.(xlsx?|csv)$/)) return 'text-emerald-600'
  if (lower.match(/\.(zip|rar|7z)$/)) return 'text-amber-600'
  if (lower.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'text-violet-600'
  if (lower.match(/\.(html?|css|js|ts|tsx|jsx|py|java|c|cpp)$/)) return 'text-fuchsia-600'
  return 'text-muted-foreground'
}

export function AssignmentsManager() {
  const {
    assignments,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments()
  const { isAdmin, loading: adminLoading, login, logout } = useAdmin()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Assignment | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setIsFormOpen(true)
  }
  const openEdit = (a: Assignment) => {
    setEditing(a)
    setIsFormOpen(true)
  }

  const requireAdmin = () => {
    if (!isAdmin) {
      setLoginOpen(true)
      return false
    }
    return true
  }

  const openCreateIfAdmin = () => {
    if (!requireAdmin()) return
    openCreate()
  }
  const openEditIfAdmin = (a: Assignment) => {
    if (!requireAdmin()) return
    openEdit(a)
  }
  const tryDelete = (id: string) => {
    if (!requireAdmin()) return
    setDeletingId(id)
  }

  const handleLogout = async () => {
    await logout()
    toast({ title: 'Logged out', description: 'You are now viewing in read-only mode.' })
  }

  const handleLogin = async (password: string) => {
    const res = await login(password)
    if (res.ok) {
      toast({ title: 'Welcome back, Jana!', description: 'Edit mode unlocked.' })
      setLoginOpen(false)
      return true
    }
    toast({
      title: 'Login failed',
      description: res.error || 'Wrong password',
      variant: 'destructive',
    })
    return false
  }

  const handleSubmit = async (input: AssignmentInput) => {
    setSubmitting(true)
    try {
      if (editing) {
        await updateAssignment(editing.id, input)
        toast({ title: 'Assignment updated', description: `"${input.title}" has been saved.` })
      } else {
        await createAssignment(input)
        toast({ title: 'Assignment added', description: `"${input.title}" has been added to your list.` })
      }
      setIsFormOpen(false)
      setEditing(null)
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setSubmitting(true)
    try {
      await deleteAssignment(deletingId)
      toast({ title: 'Assignment deleted' })
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Failed to delete',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
      setDeletingId(null)
    }
  }

  const handleDownloadFile = (assignmentId: string, file: AssignmentFile) => {
    window.open(`/api/assignments/${assignmentId}?download=1&fileId=${file.id}`, '_blank')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            My Assignments
          </h3>
          <p className="text-muted-foreground mt-2 max-w-xl">
            {isAdmin
              ? 'You are in edit mode — upload, edit, or remove assignments freely.'
              : 'Browse and download my course assignments below. Only the owner can add or edit.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {adminLoading ? (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking access…
            </span>
          ) : isAdmin ? (
            <>
              <Button
                onClick={openCreate}
                size="lg"
                className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
              <Button
                onClick={handleLogout}
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setLoginOpen(true)}
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Owner login
            </Button>
          )}
        </div>
      </div>

      {!adminLoading && !isAdmin && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
          <Eye className="w-3.5 h-3.5" />
          Read-only view · {assignments.length} assignment{assignments.length === 1 ? '' : 's'} available to download
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-2xl p-10 sm:p-16 text-center bg-muted/40"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/40 mb-4">
            <FileUp className="w-7 h-7 text-primary" />
          </div>
          <h4 className="font-serif text-2xl mb-2 font-semibold text-foreground">
            No assignments yet
          </h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isAdmin
              ? 'Click Add Assignment to upload your first files — PDFs, Word, PowerPoint, Excel, images, and more.'
              : 'The owner hasn’t uploaded any assignments yet. Please check back later.'}
          </p>
          {isAdmin && (
            <Button onClick={openCreate} variant="outline" className="rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add your first assignment
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {assignments.map((a, i) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                className="group bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary text-secondary-foreground shrink-0">
                    <Files className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm leading-tight text-foreground line-clamp-2">
                      {a.title}
                    </p>
                    {a.course && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {a.course}
                      </p>
                    )}
                  </div>
                </div>

                {a.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {a.description}
                  </p>
                )}

                {/* Files list */}
                {a.files.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {a.files.map((file, fi) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors group/file"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(file.fileName)}`} />
                          <span className="text-xs truncate text-foreground">
                            {file.fileName}
                          </span>
                          {file.fileSize > 0 && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatBytes(file.fileSize)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(a.id, file)}
                          className="opacity-0 group-hover/file:opacity-100 transition-opacity text-muted-foreground hover:text-primary shrink-0"
                          aria-label={`Download ${file.fileName}`}
                          title="Download this file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-border/60 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(a.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      {a.files.length} file{a.files.length === 1 ? '' : 's'}
                    </span>
                    {a.files.length > 0 && (
                      <span className="text-muted-foreground/80">
                        {formatBytes(a.files.reduce((s, f) => s + f.fileSize, 0))}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditIfAdmin(a)}
                        className="rounded-full text-xs h-8"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => tryDelete(a.id)}
                        className="rounded-full text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AssignmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editing={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The assignment and all attached files
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminLoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={handleLogin}
      />
    </div>
  )
}

type FormDialogProps = {
  open: boolean
  onOpenChange: (o: boolean) => void
  editing: Assignment | null
  submitting: boolean
  onSubmit: (input: AssignmentInput) => Promise<void>
}

function AssignmentFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: FormDialogProps) {
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [description, setDescription] = useState('')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [removeFileIds, setRemoveFileIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Track which existing files are kept (only those not in removeFileIds)
  useResetOnOpen(open, () => {
    setTitle(editing?.title || '')
    setCourse(editing?.course || '')
    setDescription(editing?.description || '')
    setNewFiles([])
    setRemoveFileIds([])
    setError(null)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    const input: AssignmentInput = {
      title: title.trim(),
      description: description.trim(),
      course: course.trim(),
      newFiles,
      removeFileIds,
    }
    await onSubmit(input)
  }

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return
    setNewFiles((prev) => [...prev, ...Array.from(selected)])
    // Reset input value so same file can be re-added later if removed
    e.target.value = ''
  }

  const removeNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const toggleRemoveExisting = (fileId: string) => {
    setRemoveFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

  const keptExistingFiles = editing?.files.filter(
    (f) => !removeFileIds.includes(f.id)
  ) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Edit Assignment' : 'Add New Assignment'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update details, add more files, or remove attached files.'
              : 'Fill in the details and attach one or more files (PDF, Word, PPT, Excel, images, code, ZIP...).'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assignment 1 — HTML Basics"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Web Design and Development"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about this assignment..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Assignment files</Label>

            {/* Existing files (only in edit mode) */}
            {editing && editing.files.length > 0 && (
              <div className="space-y-1.5 mb-2">
                <p className="text-xs text-muted-foreground font-medium">Current files:</p>
                {editing.files.map((file) => {
                  const isMarkedForRemoval = removeFileIds.includes(file.id)
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        isMarkedForRemoval
                          ? 'border-destructive/40 bg-destructive/5 line-through'
                          : 'border-border bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(file.fileName)}`} />
                        <span className="text-sm truncate">{file.fileName}</span>
                        {file.fileSize > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({formatBytes(file.fileSize)})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleRemoveExisting(file.id)}
                        className={`shrink-0 text-xs px-2 py-1 rounded-full transition-colors ${
                          isMarkedForRemoval
                            ? 'bg-primary text-primary-foreground hover:opacity-80'
                            : 'text-destructive hover:bg-destructive/10'
                        }`}
                      >
                        {isMarkedForRemoval ? 'Restore' : 'Remove'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Newly added files (not yet saved) */}
            {newFiles.length > 0 && (
              <div className="space-y-1.5 mb-2">
                <p className="text-xs text-muted-foreground font-medium">
                  New files to add ({newFiles.length}):
                </p>
                {newFiles.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-emerald-400/40 bg-emerald-50"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(f.name)}`} />
                      <span className="text-sm truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatBytes(f.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="shrink-0 text-destructive hover:bg-destructive/10 rounded-full p-1"
                      aria-label="Remove this file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File picker */}
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer py-2"
              >
                <FileUp className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to choose files (max 10MB each, up to 20 files)
                </span>
                <span className="text-xs text-muted-foreground/70">
                  PDF, Word, PowerPoint, Excel, images, code, ZIP...
                </span>
                <input
                  id="file"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleAddFiles}
                />
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-full">
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : editing ? (
                <Pencil className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {editing ? 'Save Changes' : 'Add Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Small helper hook to reset form state when dialog opens
function useResetOnOpen(open: boolean, cb: () => void) {
  useEffect(() => {
    if (open) cb()
  }, [open])
}

type AdminLoginDialogProps = {
  open: boolean
  onOpenChange: (o: boolean) => void
  onLogin: (password: string) => Promise<boolean>
}

function AdminLoginDialog({ open, onOpenChange, onLogin }: AdminLoginDialogProps) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useResetOnOpen(open, () => {
    setPassword('')
    setError(null)
    setSubmitting(false)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Please enter the password')
      return
    }
    setSubmitting(true)
    setError(null)
    const ok = await onLogin(password)
    if (!ok) {
      setError('Wrong password — please try again')
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <DialogTitle>Owner login</DialogTitle>
          <DialogDescription>
            Enter your password to unlock edit mode. Visitors stay in
            read-only mode.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-full">
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Unlock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
