'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { FlashcardCollection } from '@/lib/types'
import { StickyHeader } from '@/app/(components)/Header'

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<FlashcardCollection[]>([])
  const stickyNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }

    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (id: string) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header ref={stickyNavRef} className="w-full fixed top-0 left-0 z-50">
        <StickyHeader containerRef={stickyNavRef} />
      </header>
      <div className="w-full pt-20 px-6"> 
        <div className="text-center mb-8 mt-14">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Flashcard Collections</h1>
          <p className="text-lg text-gray-600">Browse through your flashcards and click to view details.</p>
        </div>
        <div className="w-full max-w-screen-md mx-auto">
          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6 w-full"
            >
              <div
                onClick={() => {
                  handleCardClick(flashcard.name);
                }}
                className="p-6 text-center"
              >
                <h2 className="text-xl font-semibold text-gray-700">{flashcard.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );

}
