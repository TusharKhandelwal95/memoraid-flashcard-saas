import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const formatAmountForStripe = (amount: number) => {
  return Math.round(amount * 100)
}

async function createCheckoutSession(request: Request) {  
  const originUrl = request.headers.get('Origin')
  if (!originUrl) {
    throw new Error('Origin header is missing')
  }
  
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Pro subscription', // TODO: Make this dynamic based on the plan chosen
          },
          unit_amount: formatAmountForStripe(10), // $10.00 // TODO: Make this dynamic based on the plan chosen
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${originUrl}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${originUrl}/result?session_id={CHECKOUT_SESSION_ID}`,
  }

  return await stripe.checkout.sessions.create(params)
}

export async function POST(request: NextRequest) {
  try {
    const checkoutSession = await createCheckoutSession(request)
    return NextResponse.json(checkoutSession, { status: 200 })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse(JSON.stringify({ error: { message: (error as Error).message } }), {
      status: 500,
    })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: { message: (error as Error).message } }, { status: 500 })
  }
}
