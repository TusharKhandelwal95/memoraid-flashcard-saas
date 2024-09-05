
"use client";

import { useRef } from "react";
import { Hero } from "./(components)/Hero";
import { Features } from "./(components)/Features";
import { Pricing } from "./(components)/Pricing";
import { getStripe } from "@/lib/stripe";
import { StickyHeader } from "./(components)/Header";

export default function Home() {
    const containerRef = useRef(null);

    const handleSubscribe = async () => {
        const checkoutSession = await fetch('/api/checkout-session', {
            method: 'POST'
        })
        const checkoutSessionData = await checkoutSession.json()

        if (checkoutSession.status === 500) {
            console.error(checkoutSessionData.error)
            return
        }

        const stripe = await getStripe()
        if (!stripe) {
            console.error('Stripe not loaded properly')
            return
        }

        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionData.id
        })

        if (error) {
            console.warn(error.message)
        }
    }
    return (
        <main
            ref={containerRef}
            className=" bg-gray-100 h-full w-full overflow-y-auto"
        >
            <StickyHeader containerRef={containerRef} />
            <Hero />
            <div className="flex justify-center items-center w-full px-4">
                <div className="max-w-screen-lg w-full" id="features">
                    <Features />
                </div>
            </div>
            <div id="pricing">
                <Pricing handleSubscribe={handleSubscribe} />
            </div>
            <div>
                <section
                    id="clients"
                    className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
                >

                </section>
            </div>


        </main>
    );
}
