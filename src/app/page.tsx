'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function Home() {
    const features = [
        {
            name: 'Speed and Simplicity',
            description: 'Get a ready-made document in minutes without long searches for templates.',
        },
        {
            name: 'AI + Templates',
            description: 'A hybrid approach where the document is generated based on legally correct templates, reducing the risk of errors.',
        },
        {
            name: 'Legal Tips',
            description: 'Makes the service valuable not only for generation but also as a mini-assistant.',
        },
        {
            name: 'White-label for Lawyers',
            description: 'A real channel for B2B monetization (lawyers, notaries, HR).',
        },
        {
            name: 'Freemium Model',
            description: 'Low barrier to entry for new users to try out the service.',
        }
    ];

    return (
        <div className="bg-white text-text-DEFAULT">
            <section className="text-center py-20 px-4">
                <h1 className="text-5xl font-bold mb-4">Create Legal Documents with AI</h1>
                <p className="text-xl text-text-light mb-8 max-w-2xl mx-auto">
                    Generate legally sound documents in minutes. Our AI-powered platform combines professional templates with intelligent suggestions to save you time and money.
                </p>
                <Link href="/signup" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                    Get Started for Free
                </Link>
            </section>

            <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-success mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                                        <p className="text-text-light">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}