"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { getUserForVerification, approveUserOnboarding, declineUserOnboarding } from "./actions"
import { User } from "~/db/schema/user"
import { CheckCircle2, XCircle, Loader2, FileText, Mail, User as UserIcon, Calendar } from "lucide-react"

export default function VerifyUserPage() {
    const params = useParams()
    const userId = params.userId as string

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [showDeclineForm, setShowDeclineForm] = useState(false)
    const [declineReason, setDeclineReason] = useState("")

    useEffect(() => {
        loadUser()
    }, [userId])

    const loadUser = async () => {
        setLoading(true)
        const result = await getUserForVerification(userId)
        if (result.success && result.user) {
            setUser(result.user)
        } else {
            toast.error(result.error || "Failed to load user")
        }
        setLoading(false)
    }

    const handleApprove = async () => {
        setProcessing(true)
        const result = await approveUserOnboarding(userId)
        if (result.success) {
            toast.success("User approved successfully!")
            loadUser()
        } else {
            toast.error(result.error || "Failed to approve user")
        }
        setProcessing(false)
    }

    const handleDecline = async () => {
        if (!declineReason.trim()) {
            toast.error("Please provide a reason for declining")
            return
        }

        setProcessing(true)
        const result = await declineUserOnboarding(userId, declineReason)
        if (result.success) {
            toast.success("User declined and notified via email")
            setShowDeclineForm(false)
            setDeclineReason("")
            loadUser()
        } else {
            toast.error(result.error || "Failed to decline user")
        }
        setProcessing(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>User Not Found</CardTitle>
                        <CardDescription>The requested user could not be found.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const alreadyProcessed = user.onboarding_status !== 'pending'

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">User Verification</h1>
                    <p className="text-muted-foreground mt-2">Review and verify user onboarding information</p>
                </div>

                {alreadyProcessed && (
                    <Card className={`border-2 ${user.onboarding_status === 'approved' ? 'border-green-500' : 'border-red-500'}`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-2">
                                {user.onboarding_status === 'approved' ? (
                                    <>
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        <p className="text-lg font-semibold text-green-500">This user has already been approved</p>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-6 w-6 text-red-500" />
                                        <p className="text-lg font-semibold text-red-500">This user has already been declined</p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Basic details about the user</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Verified</p>
                                    <p className="font-medium">{user.is_verified ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Registration Documents</CardTitle>
                        <CardDescription>Documents submitted by the user</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.registration_documents && user.registration_documents.length > 0 ? (
                            <div className="space-y-2">
                                {user.registration_documents.map((doc, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <a
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline flex-1"
                                        >
                                            Document {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No documents submitted</p>
                        )}
                    </CardContent>
                </Card>

                {!alreadyProcessed && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Actions</CardTitle>
                            <CardDescription>Approve or decline this user&apos;s onboarding</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!showDeclineForm ? (
                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                                Approve User
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => setShowDeclineForm(true)}
                                        disabled={processing}
                                        variant="destructive"
                                        className="flex-1"
                                        size="lg"
                                    >
                                        <XCircle className="mr-2 h-5 w-5" />
                                        Decline User
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="reason">Reason for Declining (will be sent to user)</Label>
                                        <Textarea
                                            id="reason"
                                            value={declineReason}
                                            onChange={(e) => setDeclineReason(e.target.value)}
                                            placeholder="Please provide a clear reason for declining this user's application..."
                                            className="mt-2 min-h-[120px]"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={handleDecline}
                                            disabled={processing || !declineReason.trim()}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Confirm Decline"
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowDeclineForm(false)
                                                setDeclineReason("")
                                            }}
                                            disabled={processing}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
