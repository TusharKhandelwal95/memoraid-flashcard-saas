'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { ChevronLeft } from "lucide-react"

const formatAmmountForStripe = (amount: number) => {
  // Convert amount from cents to dollars and return as 2 decimal places
  return (amount / 100).toFixed(2)
}

interface Session {
  id: string
  amount_total: number
  payment_status: string
}

const ResultPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState<boolean>(true)
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChekoutSession = async () => {
      if (!sessionId) {
        return
      }
      try {
        const res = await fetch(`/api/checkout-session?session_id=${sessionId}`)
        const sessionData = await res.json()
        if (res.ok) {
          setSession(sessionData)
          console.log(sessionData)
        } else {
          setError(sessionData.error)
        }
      } catch (err) {
        console.error(err)
        setError('An error occurred while retrieving the session.')
      } finally {
        setLoading(false)
      }
    }

    fetchChekoutSession()
  }, [sessionId])

  if (loading) {
    return (
      <Container sx={{
        maxWidth: '100vw',
        textAlign: 'center',
        mt: 4
      }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{
        maxWidth: '100vw',
        textAlign: 'center',
        mt: 4
      }}>
        <Typography variant="h6">{error}</Typography>
      </Container>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <div className="w-full max-w-screen-lg flex justify-start">
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </a>
      </div>
      {session && session.payment_status === 'paid' ? (
        <>
          <h1 className="text-4xl font-bold text-green-600 mb-8">Thank you for your payment</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg break-words">
            <p className="text-xl font-semibold mb-4">ID: {session.id}</p>
            <p className="text-xl font-semibold mb-4">Amount: {formatAmmountForStripe(session.amount_total)}</p>
            <p className="text-lg text-gray-600">You will receive an email confirmation shortly.</p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-red-600 mb-8">Payment failed</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <p className="text-lg text-gray-600">Your payment was not successful. Please try again.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ResultPage
