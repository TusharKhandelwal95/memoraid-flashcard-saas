"use client";

import { ArrowRightIcon, CheckCircledIcon } from "@radix-ui/react-icons";

interface PricingOption {
    name: string;
    price: string;
    description: string;
    features: string[];
    extraBenefits?: string;
}

const PricingCard = ({ option, handleSubscribe }: { option: PricingOption, handleSubscribe: any}) => (
    <div className="grid h-full w-full grid-cols-1 rounded-xl border border-neutral-300/50 dark:border-neutral-700/50 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col justify-between gap-y-10 rounded-t-xl bg-neutral-50 p-5 dark:bg-neutral-900 lg:rounded-t-none lg:rounded-bl-xl lg:rounded-tl-xl">
            <div className="flex flex-col gap-y-2">
                <p className="text-2xl font-semibold text-black dark:text-white">
                    {option.name}
                </p>
                <p className="mx-0 max-w-md font-medium tracking-tight text-neutral-500 dark:text-neutral-400">
                    {option.description}
                </p>
            </div>
            <div className="flex flex-col gap-y-2">
                <h3 className="text-sm font-medium text-black dark:text-white">
                    <span className="text-3xl font-[620] text-black dark:text-white">
                        {option.price}
                    </span>
                </h3>
                <button
                    onClick={() => {handleSubscribe()}}
                    className="my-2 flex h-10 w-full items-center justify-center rounded-lg border border-neutral-500 bg-neutral-800 text-base font-bold text-white transition duration-100 hover:shadow-md hover:drop-shadow-md dark:bg-neutral-100 dark:text-neutral-800"
                >
                    <span className="tracking-tight">Choose Plan</span>
                    <ArrowRightIcon className="ml-2" />
                </button>
            </div>
        </div>
        <div className="col-span-3 flex flex-col justify-center gap-y-5 p-5 lg:pl-10">
            {option.extraBenefits && (
                <p className="text-[15px] font-medium text-neutral-500">
                    {option.extraBenefits}
                </p>
            )}
            {option.features.map((feature, index) => (
                <div key={index} className="flex gap-x-3">
                    <div className="flex items-center justify-center">
                        <CheckCircledIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                        {feature}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

export function Pricing({ handleSubscribe }: { handleSubscribe: any }) {
    const pricingOptions: PricingOption[] = [
        {
            name: "Basic",
            price: "$5",
            description:
                "Get started with essential features to create and manage your flashcards effortlessly.",
            features: [
                "AI-powered card generation",
                "Standard flashcard templates",
                "Basic organizational tools",
            ],
        },
        {
            name: "Pro",
            price: "$10",
            description:
                "Unlock advanced features for power users, including premium templates and unlimited collections.",
            features: [
                "Unlimited collections",
                "Premium flashcard templates",
                "Advanced organizational tools",
            ],
            extraBenefits: "Everything in the basic plan, plus",
        },
    ];

    return (
        <section className="mx-auto max-w-5xl py-10">
            <div className="flex flex-col gap-y-2">
                <div className="mx-auto max-w-5xl text-center">
                    <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
                        Pricing
                    </h4>

                    <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
                        Simple pricing for everyone.
                    </h2>

                    <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
                        Choose an <strong>affordable plan</strong> that&apos;s packed with
                        the best features.
                    </p>
                </div>
                <div className="mx-auto grid h-full w-full max-w-4xl place-content-center items-center gap-6 px-10 py-8 lg:items-start">
                    <PricingCard option={pricingOptions[0]} handleSubscribe={handleSubscribe} />
                    <PricingCard option={pricingOptions[1]} handleSubscribe={handleSubscribe} />
                </div>
            </div>
        </section>
    );
}
