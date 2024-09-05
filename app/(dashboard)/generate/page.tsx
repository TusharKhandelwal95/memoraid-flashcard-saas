'use client'

import { useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardActionArea, Container, Typography, CardContent } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'
import { CardFlipStatus, FlashcardData, FlashcardCollection } from '@/lib/types';
import { ArrowDownToLine, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StickyHeader } from '@/app/(components)/Header';

export default function Generate() {
  const { user } = useUser();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [flipped, setFlipped] = useState<CardFlipStatus>({});
  const [text, setText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const stickyNavRef = useRef<HTMLElement>(null);

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data: FlashcardData[]) => setFlashcards(data));
  };

  const handleCardClick = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user?.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections: FlashcardCollection[] = docSnap.data().flashcards || [];
      if (collections.find(f => f.name === name)) {
        alert('Flashcard collection with the same name already exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <div className=' bg-gray-100 w-full min-h-screen'>
      <Container maxWidth="md">
        <header ref={stickyNavRef}>
          <StickyHeader containerRef={stickyNavRef} />
        </header>
        <div className="flex flex-col items-center mt-16 mb-24">
          <h1 className="text-4xl font-bold text-center mb-6">Generate Flashcards</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleSubmit}
              className={cn(
                // layout
                "group relative border inline-flex h-9 w-full items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-md px-4 py-2 text-base font-semibold tracking-tighter focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex",

                // animation
                "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2"
              )}
            >
              <span className="w-full text-center font-bold bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-transparent">
                Submit
              </span>
              <Zap className="size-4 translate-x-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {flashcards.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Flashcards Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {flashcards.map((flashcard, index) => (
                <div key={index} className="relative">
                  <Card>
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
            <div className="mt-8 flex justify-center">

              <button
                onClick={handleOpen}
                className={cn(
                  // layout
                  "group relative border inline-flex h-9 w-full items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-md px-4 py-2 text-base font-semibold tracking-tighter focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex",

                  // animation
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2"
                )}
              >
                <span className="w-full text-center font-bold bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-transparent">
                  Save
                </span>
                <ArrowDownToLine className="size-4 translate-x-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
              </button>
            </div>
            <br />
            <br />
          </div>
        )}

        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${open ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Save Flashcards</h3>
            <p className="text-gray-700 mb-4">Please enter a name for your flashcards collection</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Collection Name"
            />
            <div className="flex justify-end gap-4">
              <button onClick={handleClose} className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={saveFlashcards} className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>

  );
}
