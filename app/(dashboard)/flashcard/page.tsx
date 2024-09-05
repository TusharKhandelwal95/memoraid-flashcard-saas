'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { doc, getDocs, collection } from 'firebase/firestore'
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box } from '@mui/material'
import { CardFlipStatus, FlashcardData, FlashcardWithId } from '@/lib/types'
import { StickyHeader } from '@/app/(components)/Header'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState<FlashcardWithId[]>([]);
  const [flipped, setFlipped] = useState<CardFlipStatus>({});
  const stickyNavRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)

      const flashcards: FlashcardWithId[] = []

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() as FlashcardData })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header ref={stickyNavRef} className="w-full fixed top-0 left-0 z-50">
        <StickyHeader containerRef={stickyNavRef} />
      </header>
      <div className="pt-20 max-w-screen-lg mx-auto mt-4">
        <button
          onClick={() => window.history.back()}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Here's your flashcard collection</h1>
          <p className="text-lg text-gray-600">Click on a flashcard to view more details. 🚀 Time to study.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {flashcards.map((flashcard, index) => (
            <div key={index} className="flex justify-center">
              <Card className="w-full">
                <CardActionArea
                  onClick={() => {
                    handleCardClick(index);
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        perspective: '1000px',
                        '& > div': {
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                          transform: flipped[index]
                            ? 'rotateY(180deg)'
                            : 'rotateY(0deg)',
                        },
                        '& > div > div': {
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          px: 4,
                          py: 2,
                          boxSizing: 'border-box',
                        },
                        '& > div > div:nth-of-type(2)': {
                          transform: 'rotateY(180deg)',
                        },
                      }}
                    >
                      <div>
                        <div className="flex flex-col gap-1 text-center">
                          <Typography variant="h6" component="div" fontWeight={600} className='bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text leading-none text-transparent'>
                            Question
                          </Typography>
                          <Typography variant="h6" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                          <Typography variant="h6" component="div" fontWeight={600} className='bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text leading-none text-transparent'>
                            Answer
                          </Typography>
                          <Typography variant="body1" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
    </div>


  )
}
