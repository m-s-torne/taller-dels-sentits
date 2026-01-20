import type { Quote } from '@/app/_types/services.types';

interface StaticQuoteProps {
    quote: Quote;
}

export const StaticQuote = ({ quote }: StaticQuoteProps) => {
    return (
        <div className="mb-16 flex items-center justify-center">
            <div className="w-full text-center px-8">
                <p className="text-shakespeare! text-base sm:text-xl font-light italic mb-4 leading-relaxed">
                    "{quote.text}"
                </p>
                <p className="text-xs sm:text-sm">
                    {quote.author}
                </p>
            </div>
        </div>
    );
};
