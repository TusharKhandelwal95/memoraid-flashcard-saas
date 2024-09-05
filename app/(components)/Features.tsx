export function Features() {
    return (
        <div className="my-12">
            <h2 className="text-5xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-4">Easy Payment Integration</h3>
                    <p>
                        Seamlessly manage transactions with secure and intuitive payment processing.
                    </p>
                </div>
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-4">Fast AI Card Generation</h3>
                    <p>
                        Generate personalized flashcards instantly with advanced AI technology.
                    </p>
                </div>
                <div className="p-6 border rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-4">Grouping in Collections</h3>
                    <p>
                        Organize and categorize your flashcards into collections for focused learning.
                    </p>
                </div>
            </div>
        </div>
    );
}
