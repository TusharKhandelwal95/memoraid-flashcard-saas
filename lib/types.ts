export interface FlashcardCollection {
  name: string;
}

export interface FlashcardData {
  front: string
  back: string
}

export interface FlashcardWithId extends FlashcardData {
  id: string;
}

export interface CardFlipStatus {
  [key: number]: boolean;
}
