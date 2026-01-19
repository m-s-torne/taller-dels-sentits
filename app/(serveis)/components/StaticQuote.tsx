import type { Quote } from '@/app/_types/services.types';

interface StaticQuoteProps {
    quote: Quote;
}

export const StaticQuote = ({ quote }: StaticQuoteProps) => {
    return (
        <div className="h-35 pt-5 mb-4 md:mb-6 flex items-start justify-center">
            <div className="w-full text-center px-8">
                <p className="text-shakespeare! text-base sm:text-xl font-light italic mb-2 leading-relaxed">
                    "{quote.text}"
                </p>
                <p className="text-xs sm:text-sm">
                    {quote.author}
                </p>
            </div>
        </div>
    );
};
